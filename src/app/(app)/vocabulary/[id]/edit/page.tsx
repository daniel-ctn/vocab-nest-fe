import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { getVocabularyWithGroups } from '@/lib/data/vocabulary'
import { listGroups } from '@/lib/data/groups'
import { VocabularyForm } from '../../new/vocabulary-form'
import { DeleteVocabularyButton } from '../delete-button'
import { GroupAssignment } from '../group-assignment'

export default async function VocabularyEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireUser()
  const data = await getVocabularyWithGroups(id, user.id)
  if (!data) {
    redirect('/vocabulary')
  }

  const { entry, groupIds } = data
  const groups = await listGroups(user.id)

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <VocabularyForm
        mode="edit"
        entry={entry}
        extraActions={<DeleteVocabularyButton id={entry.id} />}
      />

      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          Groups
        </h2>
        <GroupAssignment
          vocabularyId={entry.id}
          groups={groups}
          assignedGroupIds={groupIds}
        />
      </div>
    </div>
  )
}
