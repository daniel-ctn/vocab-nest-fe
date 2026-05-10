'use client'

import { useState, useTransition } from 'react'
import { Plus, Search, Loader2, X } from 'lucide-react'
import { addVocabularyToGroup } from '@/lib/actions/groups'
import type { VocabularyEntry } from '@/lib/contracts'

export function AddWordsToGroup({
  groupId,
  words,
}: {
  groupId: string
  words: VocabularyEntry[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [addingId, setAddingId] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const filtered = words.filter(
    (w) =>
      w.term.toLowerCase().includes(query.toLowerCase()) ||
      w.definition.toLowerCase().includes(query.toLowerCase())
  )

  function handleAdd(vocabularyId: string) {
    setAddingId(vocabularyId)
    startTransition(async () => {
      try {
        await addVocabularyToGroup(vocabularyId, groupId)
        setAddedIds((prev) => new Set(prev).add(vocabularyId))
      } catch {
        alert('Failed to add word')
      } finally {
        setAddingId(null)
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-subtle text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
      >
        <Plus size={16} />
        Add words
      </button>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-ink">Add words to this group</h3>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-md text-ink-tertiary hover:text-ink hover:bg-border-subtle transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vocabulary..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-cream border border-border text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-ink-secondary py-2">
            {query
              ? 'No matches found.'
              : 'All words are already in this group.'}
          </p>
        ) : (
          filtered.map((word) => {
            const isAdded = addedIds.has(word.id)
            return (
              <div
                key={word.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-cream border border-border"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {word.term}
                  </p>
                  <p className="text-xs text-ink-secondary truncate">
                    {word.definition}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(word.id)}
                  disabled={isPending || isAdded}
                  className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isAdded
                      ? 'bg-success-subtle text-success'
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  {addingId === word.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : isAdded ? (
                    'Added'
                  ) : (
                    <>
                      <Plus size={12} />
                      Add
                    </>
                  )}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
