import { describe, expect, it } from 'vitest'
import {
  getCurrentPeriodEnd,
  getFirstPriceId,
  getMetadataUserId,
  getStripeReferenceId,
} from './stripe-webhook'

describe('stripe webhook helpers', () => {
  it('reads the app user id from Stripe metadata', () => {
    expect(getMetadataUserId({ metadata: { userId: 'user_123' } })).toBe(
      'user_123'
    )
  })

  it('ignores missing or blank metadata user ids', () => {
    expect(getMetadataUserId({ metadata: null })).toBeNull()
    expect(getMetadataUserId({ metadata: { userId: '   ' } })).toBeNull()
  })

  it('normalizes expanded and string Stripe references', () => {
    expect(getStripeReferenceId('cus_123')).toBe('cus_123')
    expect(getStripeReferenceId({ id: 'cus_456' })).toBe('cus_456')
    expect(getStripeReferenceId(null)).toBeNull()
  })

  it('extracts subscription period and price data', () => {
    expect(getCurrentPeriodEnd({ current_period_end: 1_800_000_000 })).toEqual(
      new Date(1_800_000_000_000)
    )
    expect(
      getCurrentPeriodEnd({
        items: { data: [{ current_period_end: 1_900_000_000 }] },
      })
    ).toEqual(new Date(1_900_000_000_000))
    expect(
      getFirstPriceId({ items: { data: [{ price: { id: 'price_123' } }] } })
    ).toBe('price_123')
  })
})
