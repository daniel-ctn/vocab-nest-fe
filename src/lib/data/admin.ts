import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  groups,
  practiceItems,
  practiceSessions,
  user,
  userStats,
  vocabularyEntries,
} from '@/lib/db/schema'
import { isAdmin } from '@/lib/admin'

export type AdminStats = {
  totalUsers: number
  totalVocabulary: number
  totalGroups: number
  totalPracticeSessions: number
  totalReviews: number
  avgStreak: number
  topUsers: {
    id: string
    name: string
    email: string
    vocabularyCount: number
    streakDays: number
  }[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }
  const totalUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .then((rows) => Number(rows[0]?.count ?? 0))

  const totalVocabulary = await db
    .select({ count: sql<number>`count(*)` })
    .from(vocabularyEntries)
    .then((rows) => Number(rows[0]?.count ?? 0))

  const totalGroups = await db
    .select({ count: sql<number>`count(*)` })
    .from(groups)
    .then((rows) => Number(rows[0]?.count ?? 0))

  const totalPracticeSessions = await db
    .select({ count: sql<number>`count(*)` })
    .from(practiceSessions)
    .then((rows) => Number(rows[0]?.count ?? 0))

  const totalReviews = await db
    .select({ count: sql<number>`count(*)` })
    .from(practiceItems)
    .where(sql`${practiceItems.reviewedAt} is not null`)
    .then((rows) => Number(rows[0]?.count ?? 0))

  const avgStreakResult = await db
    .select({ avg: sql<number>`coalesce(avg(${userStats.streakDays}), 0)` })
    .from(userStats)
    .then((rows) => Number(rows[0]?.avg ?? 0))

  const topUsersRows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      streakDays: userStats.streakDays,
      vocabCount: sql<number>`count(${vocabularyEntries.id})`,
    })
    .from(user)
    .leftJoin(userStats, eq(user.id, userStats.userId))
    .leftJoin(vocabularyEntries, eq(user.id, vocabularyEntries.userId))
    .groupBy(user.id, user.name, user.email, userStats.streakDays)
    .orderBy(sql`count(${vocabularyEntries.id}) desc`)
    .limit(10)

  return {
    totalUsers,
    totalVocabulary,
    totalGroups,
    totalPracticeSessions,
    totalReviews,
    avgStreak: Math.round(avgStreakResult),
    topUsers: topUsersRows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      vocabularyCount: Number(u.vocabCount),
      streakDays: u.streakDays ?? 0,
    })),
  }
}
