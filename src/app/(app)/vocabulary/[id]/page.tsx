import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calendar,
  Flame,
  Pencil,
  Tag,
  TrendingUp,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { getVocabularyDetail } from '@/lib/data/vocabulary'
import { SpeakButton } from '@/components/speak-button'

export default async function VocabularyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const data = await getVocabularyDetail(id, user.id)
  if (!data) {
    redirect('/vocabulary')
  }

  const { entry, groupNames, stats } = data

  const isDue = stats
    ? new Date(stats.nextReviewAt) <= new Date()
    : true

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        href="/vocabulary"
        className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink transition-colors"
      >
        <ArrowLeft size={16} />
        Back to vocabulary
      </Link>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
                {entry.term}
              </h1>
              <SpeakButton text={entry.term} />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {entry.partOfSpeech && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-border-subtle text-xs font-medium text-ink-secondary uppercase">
                  {entry.partOfSpeech}
                </span>
              )}
              {entry.language && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-border-subtle text-xs font-medium text-ink-secondary uppercase">
                  {entry.language}
                </span>
              )}
              {entry.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/vocabulary?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-accent-subtle text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
                >
                  <Tag size={10} />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href={`/vocabulary/${entry.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-ink-secondary hover:bg-border-subtle transition-colors shrink-0"
          >
            <Pencil size={14} />
            Edit
          </Link>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border">
          <div className="text-xs text-ink-tertiary uppercase tracking-wide font-medium mb-2">
            Definition
          </div>
          <p className="text-lg text-ink leading-relaxed">
            {entry.definition}
          </p>
        </div>

        {entry.examples.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-cream border border-border">
            <div className="text-xs text-ink-tertiary uppercase tracking-wide font-medium mb-3">
              Examples
            </div>
            <ul className="space-y-2">
              {entry.examples.map((example, i) => (
                <li key={i} className="text-ink flex items-start gap-2">
                  <span className="text-ink-tertiary mt-1.5 shrink-0">•</span>
                  <span className="leading-relaxed">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {groupNames.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-ink-tertiary uppercase tracking-wide font-medium">
              Groups
            </div>
            <div className="flex flex-wrap gap-2">
              {groupNames.map((g) => (
                <Link
                  key={g.id}
                  href={`/groups/${g.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-ink hover:border-accent/30 transition-colors"
                >
                  <BookOpen size={12} className="text-ink-secondary" />
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {stats && (
          <div className="space-y-3">
            <div className="text-xs text-ink-tertiary uppercase tracking-wide font-medium">
              Review Stats
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-ink-secondary mb-1">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium">Accuracy</span>
                </div>
                <div className="text-xl font-display font-semibold text-ink">
                  {stats.accuracy}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-ink-secondary mb-1">
                  <BrainCircuit size={14} />
                  <span className="text-xs font-medium">Reviews</span>
                </div>
                <div className="text-xl font-display font-semibold text-ink">
                  {stats.totalReviews}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-ink-secondary mb-1">
                  <Flame size={14} />
                  <span className="text-xs font-medium">Streak</span>
                </div>
                <div className="text-xl font-display font-semibold text-ink">
                  {stats.consecutiveCorrect}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <div className="flex items-center justify-center gap-1.5 text-ink-secondary mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Interval</span>
                </div>
                <div className="text-xl font-display font-semibold text-ink">
                  {stats.intervalDays}d
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
              <div className="text-sm text-ink-secondary">
                {isDue ? (
                  <span className="text-success font-medium">
                    Due for review
                  </span>
                ) : (
                  <span>
                    Next review{' '}
                    <span className="text-ink font-medium">
                      {new Date(stats.nextReviewAt).toLocaleDateString()}
                    </span>
                  </span>
                )}
              </div>
              {isDue && (
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Start practice
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
