import Link from 'next/link'
import { ArrowLeft, ArrowRight, BrainCircuit } from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { getOrCreateTodayPractice } from '@/lib/data/practice'
import { getGroupWithVocabulary } from '@/lib/data/groups'
import { PracticeRunner } from './practice-runner'

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>
}) {
  const { group: groupId } = await searchParams
  const user = await getCurrentUser()

  const [today, groupData] = await Promise.all([
    getOrCreateTodayPractice(user.id, groupId),
    groupId ? getGroupWithVocabulary(groupId, user.id) : null,
  ])

  if (!today) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-border-subtle flex items-center justify-center mb-4">
          <BrainCircuit size={28} className="text-ink-secondary" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          All caught up
        </h2>
        <p className="text-ink-secondary mt-2 max-w-sm">
          {groupData
            ? `No words in "${groupData.group.name}" are due for review right now.`
            : 'You have no words due for review today. Add more vocabulary to keep learning.'}
        </p>
        {groupData ? (
          <Link
            href={`/groups/${groupId}`}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to {groupData.group.name}
          </Link>
        ) : (
          <Link
            href="/vocabulary/new"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <ArrowRight size={16} />
            Add a word
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groupData && (
        <div className="flex items-center gap-2 text-sm text-ink-secondary">
          <Link
            href={`/groups/${groupId}`}
            className="inline-flex items-center gap-1 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            {groupData.group.name}
          </Link>
          <span>/</span>
          <span>Practice</span>
        </div>
      )}
      <PracticeRunner session={today.session} definitions={today.definitions} />
    </div>
  )
}
