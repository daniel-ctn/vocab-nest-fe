import { getCurrentUser } from '@/lib/session'
import { listVocabulary } from '@/lib/data/vocabulary'
import { VocabularyList } from './vocabulary-list'
import { BulkImport } from './bulk-import'

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const user = await getCurrentUser()
  const entries = await listVocabulary(user.id, tag)
  return (
    <div className="space-y-6">
      <BulkImport />
      <VocabularyList entries={entries} activeTag={tag} />
    </div>
  )
}
