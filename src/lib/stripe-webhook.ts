type StripeReference = string | { id?: string | null } | null | undefined

type MetadataCarrier = {
  metadata?: Record<string, string> | null
}

type SubscriptionLineItems = {
  data?: Array<{
    current_period_end?: number | null
    price?: {
      id?: string | null
    } | null
  }>
}

export function getStripeReferenceId(value: StripeReference): string | null {
  if (typeof value === 'string') return value
  return value?.id ?? null
}

export function getMetadataUserId(value: MetadataCarrier): string | null {
  const userId = value.metadata?.userId
  return userId && userId.trim().length > 0 ? userId : null
}

export function getCurrentPeriodEnd(value: {
  current_period_end?: number | null
  items?: SubscriptionLineItems | null
}): Date | null {
  const periodEnd =
    value.current_period_end ?? value.items?.data?.[0]?.current_period_end

  return periodEnd ? new Date(periodEnd * 1000) : null
}

export function getFirstPriceId(value: {
  items?: SubscriptionLineItems | null
}): string | null {
  return value.items?.data?.[0]?.price?.id ?? null
}
