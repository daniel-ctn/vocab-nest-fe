'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import {
  addVocabularyToGroup,
  removeVocabularyFromGroup,
} from '@/lib/actions/groups'
import type { Group } from '@/lib/contracts'

export function GroupAssignment({
  vocabularyId,
  groups,
  assignedGroupIds,
}: {
  vocabularyId: string
  groups: Group[]
  assignedGroupIds: string[]
}) {
  const [assigned, setAssigned] = useState<Set<string>>(
    new Set(assignedGroupIds)
  )
  const [isPending, startTransition] = useTransition()

  function toggle(groupId: string) {
    const next = new Set(assigned)
    const isAdding = !next.has(groupId)

    if (isAdding) {
      next.add(groupId)
    } else {
      next.delete(groupId)
    }
    setAssigned(next)

    startTransition(async () => {
      try {
        if (isAdding) {
          await addVocabularyToGroup(vocabularyId, groupId)
        } else {
          await removeVocabularyFromGroup(vocabularyId, groupId)
        }
      } catch {
        alert('Failed to update group assignment')
        setAssigned(new Set(assigned))
      }
    })
  }

  if (groups.length === 0) {
    return (
      <p className="text-sm text-ink-tertiary">
        No groups yet. Create one from the Groups page.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isAssigned = assigned.has(group.id)
        return (
          <button
            key={group.id}
            type="button"
            disabled={isPending}
            onClick={() => toggle(group.id)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors border ${
              isAssigned
                ? 'bg-accent-subtle border-accent/30 text-accent'
                : 'bg-surface border-border text-ink-secondary hover:bg-border-subtle'
            }`}
          >
            <span className="font-medium">{group.name}</span>
            {isPending && assigned.has(group.id) !== isAssigned ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isAssigned ? (
              <Check size={14} />
            ) : (
              <X size={14} className="opacity-30" />
            )}
          </button>
        )
      })}
    </div>
  )
}
