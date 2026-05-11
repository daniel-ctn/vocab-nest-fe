import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export function getStripePriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not set')
  }
  return priceId
}

export function getStripeAnnualPriceId(): string | undefined {
  return process.env.STRIPE_ANNUAL_PRICE_ID
}
