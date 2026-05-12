import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { subscriptions, user } from '@/lib/db/schema'
import { upsertSubscription } from '@/lib/data/subscription'
import {
  getCurrentPeriodEnd,
  getFirstPriceId,
  getMetadataUserId,
  getStripeReferenceId,
} from '@/lib/stripe-webhook'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }
  return secret
}

async function getUserIdById(userId: string) {
  const userRow = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)
    .then((rows) => rows[0])

  return userRow?.id ?? null
}

async function getUserIdByEmail(email: string | null | undefined) {
  if (!email) return null

  const userRow = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
    .then((rows) => rows[0])

  return userRow?.id ?? null
}

async function getExistingSubscriptionUserId(customerId: string) {
  const subRow = await db
    .select({ userId: subscriptions.userId })
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1)
    .then((rows) => rows[0])

  return subRow?.userId ?? null
}

async function upsertStripeSubscription(
  subscription: Stripe.Subscription,
  userId: string | null
) {
  const customerId = getStripeReferenceId(subscription.customer)
  if (!customerId || !userId) return false

  await upsertSubscription({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: getFirstPriceId(subscription),
    status: subscription.status,
    currentPeriodEnd: getCurrentPeriodEnd(subscription),
  })

  return true
}

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  const stripe = getStripe()

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getWebhookSecret()
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.customer) {
          const metadataUserId = getMetadataUserId(session)
          const userId = metadataUserId
            ? await getUserIdById(metadataUserId)
            : await getUserIdByEmail(
                session.customer_details?.email ?? session.customer_email
              )

          if (!userId) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            )
          }

          const subscriptionId = getStripeReferenceId(session.subscription)
          if (!subscriptionId) {
            return NextResponse.json(
              { error: 'Subscription not found' },
              { status: 404 }
            )
          }

          const subscription =
            await getStripe().subscriptions.retrieve(subscriptionId)
          await upsertStripeSubscription(subscription, userId)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = getStripeReferenceId(subscription.customer)

        if (!customerId) break

        const metadataUserId = getMetadataUserId(subscription)
        const userId = metadataUserId
          ? await getUserIdById(metadataUserId)
          : await getExistingSubscriptionUserId(customerId)

        await upsertStripeSubscription(subscription, userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = getStripeReferenceId(subscription.customer)

        if (!customerId) break

        const metadataUserId = getMetadataUserId(subscription)
        const userId = metadataUserId
          ? await getUserIdById(metadataUserId)
          : await getExistingSubscriptionUserId(customerId)

        if (userId) {
          await db
            .update(subscriptions)
            .set({
              status: 'canceled',
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, userId))
        }
        break
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Webhook handler failed: ${message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
