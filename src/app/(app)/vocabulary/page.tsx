import { requireUser } from '@/lib/session'
import { isPro } from '@/lib/data/subscription'
import { getDashboardSummary } from '@/lib/data/dashboard'
import { listVocabulary } from '@/lib/data/vocabulary'
import { VocabularyList } from './vocabulary-list'
import { BulkImport } from './bulk-import'

const FREE_WORD_LIMIT = 100

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const user = await requireUser()
  const [entries, pro, stats] = await Promise.all([
    listVocabulary(user.id, tag),
    isPro(user.id),
    getDashboardSummary(user.id),
  ])

  const atLimit = !pro && stats.totalVocabulary >= FREE_WORD_LIMIT

  return (
    <div className="space-y-6">
      {pro && <BulkImport />}
      {atLimit && (
        <div className="p-4 rounded-xl bg-accent-subtle border border-accent/20 text-sm text-accent">
          You&apos;ve reached the free plan limit of {FREE_WORD_LIMIT} words.
          {' '}
          <a href="/upgrade" className="font-medium underline">
            Upgrade to Pro
          </a>{' '}
          to add unlimited vocabulary.
        </div>
      )}
      <VocabularyList
        entries={entries}
        activeTag={tag}
        atLimit={atLimit}
        isPro={pro}
      />
    </div>
  )
}
