import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { getLearningStats } from '@/lib/data/stats'

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-border-subtle text-ink-secondary shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-2xl font-display font-semibold text-ink leading-none">
          {value}
        </div>
        <div className="text-sm text-ink-secondary mt-1">{label}</div>
      </div>
    </div>
  )
}

export default async function StatsPage() {
  const user = await getCurrentUser()
  const stats = await getLearningStats(user.id)

  const totalMastery = stats.masteryDistribution.reduce(
    (s, b) => s + b.count,
    0
  )

  const maxActivity = Math.max(
    ...stats.recentActivity.map((d) => d.count),
    1
  )

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Stats
        </h1>
        <p className="text-ink-secondary mt-1">
          Insights into your learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total words"
          value={stats.totalVocabulary}
          icon={BookOpen}
        />
        <StatCard
          label="Due today"
          value={stats.dueToday}
          icon={BrainCircuit}
        />
        <StatCard
          label="Overall accuracy"
          value={`${stats.overallAccuracy}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            Mastery distribution
          </h2>
          <span className="text-sm text-ink-secondary">
            {totalMastery} words tracked
          </span>
        </div>

        {totalMastery === 0 ? (
          <p className="text-sm text-ink-secondary">
            Start practicing to see your mastery distribution.
          </p>
        ) : (
          <>
            <div className="flex items-end gap-2 h-40">
              {stats.masteryDistribution.map((bucket) => {
                const pct =
                  totalMastery > 0
                    ? Math.round((bucket.count / totalMastery) * 100)
                    : 0
                return (
                  <div
                    key={bucket.label}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="text-sm font-display font-semibold text-ink">
                      {bucket.count}
                    </div>
                    <div className="w-full flex-1 rounded-lg bg-border-subtle overflow-hidden relative">
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${bucket.color} opacity-80 rounded-lg transition-all`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-ink-secondary font-medium">
                      {bucket.label}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.masteryDistribution.map((bucket) => (
                <div
                  key={bucket.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className={`w-3 h-3 rounded-full ${bucket.color}`}
                  />
                  <span className="text-ink-secondary">{bucket.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-5">
        <h2 className="font-display text-xl font-semibold text-ink">
          Recent activity
        </h2>
        <div className="flex items-end gap-1.5 h-24">
          {stats.recentActivity.map((day) => {
            const pct = Math.round((day.count / maxActivity) * 100)
            const dateObj = new Date(day.date)
            const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1.5"
                title={`${label}: ${day.count} review${day.count !== 1 ? 's' : ''}`}
              >
                <div className="w-full flex-1 rounded bg-border-subtle overflow-hidden relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-accent/70 rounded transition-all"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-ink-tertiary font-medium">
                  {dayLabels[dateObj.getDay()]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Words needing attention
          </h2>
        </div>

        {stats.weakWords.length === 0 ? (
          <p className="text-sm text-ink-secondary">
            No struggling words right now. Great job!
          </p>
        ) : (
          <div className="space-y-2">
            {stats.weakWords.map((word) => (
              <Link
                key={word.id}
                href={`/vocabulary/${word.id}`}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-cream border border-border hover:border-accent/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-ink truncate">
                    {word.term}
                  </div>
                  <div className="text-xs text-ink-secondary truncate">
                    {word.definition}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-error">
                    {word.accuracy}%
                  </div>
                  <div className="text-xs text-ink-tertiary">
                    {word.totalReviews} review
                    {word.totalReviews !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Keep practicing
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
