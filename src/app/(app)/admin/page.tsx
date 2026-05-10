import { redirect } from 'next/navigation'
import { Users, BookOpen, FolderOpen, BrainCircuit, TrendingUp } from 'lucide-react'
import { isAdmin } from '@/lib/admin'
import { getAdminStats } from '@/lib/data/admin'

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

export default async function AdminPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Admin
        </h1>
        <p className="text-ink-secondary mt-1">
          Platform overview and aggregate stats.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Users" value={stats.totalUsers} icon={Users} />
        <StatCard
          label="Total words"
          value={stats.totalVocabulary}
          icon={BookOpen}
        />
        <StatCard label="Groups" value={stats.totalGroups} icon={FolderOpen} />
        <StatCard
          label="Practice sessions"
          value={stats.totalPracticeSessions}
          icon={BrainCircuit}
        />
        <StatCard
          label="Reviews completed"
          value={stats.totalReviews}
          icon={TrendingUp}
        />
        <StatCard
          label="Avg streak"
          value={stats.avgStreak}
          icon={TrendingUp}
        />
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Top learners
        </h2>
        {stats.topUsers.length === 0 ? (
          <p className="text-sm text-ink-secondary">No users yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.topUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-cream border border-border"
              >
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-ink truncate">
                    {u.name || u.email}
                  </div>
                  <div className="text-xs text-ink-secondary truncate">
                    {u.email}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-ink-secondary shrink-0">
                  <span>{u.vocabularyCount} words</span>
                  <span>{u.streakDays}d streak</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
