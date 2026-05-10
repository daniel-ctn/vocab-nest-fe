import { describe, it, expect } from 'vitest'
import { calculateNextReview } from '@/lib/data/practice'

describe('calculateNextReview', () => {
  it('increments streak and interval on remembered', () => {
    const result = calculateNextReview(true, {
      intervalDays: 1,
      easeFactor: 250,
      consecutiveCorrect: 1,
    })
    expect(result.consecutiveCorrect).toBe(2)
    expect(result.intervalDays).toBe(3)
    expect(result.easeFactor).toBe(250)
  })

  it('multiplies interval after third correct review', () => {
    const result = calculateNextReview(true, {
      intervalDays: 3,
      easeFactor: 250,
      consecutiveCorrect: 2,
    })
    expect(result.consecutiveCorrect).toBe(3)
    expect(result.intervalDays).toBe(8)
    expect(result.easeFactor).toBe(250)
  })

  it('resets on forgot', () => {
    const result = calculateNextReview(false, {
      intervalDays: 8,
      easeFactor: 250,
      consecutiveCorrect: 3,
    })
    expect(result.consecutiveCorrect).toBe(0)
    expect(result.intervalDays).toBe(1)
    expect(result.easeFactor).toBe(230)
  })

  it('does not let ease drop below 130', () => {
    const result = calculateNextReview(false, {
      intervalDays: 5,
      easeFactor: 140,
      consecutiveCorrect: 2,
    })
    expect(result.easeFactor).toBe(130)
  })
})
