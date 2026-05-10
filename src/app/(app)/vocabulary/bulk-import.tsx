'use client'

import { useState, useTransition } from 'react'
import { Upload, Loader2, X, FileText } from 'lucide-react'
import { bulkCreateVocabulary } from '@/lib/actions/vocabulary'

export function BulkImport() {
  const [open, setOpen] = useState(false)
  const [raw, setRaw] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    created: number
    failed: number
  } | null>(null)

  function handleImport() {
    const lines = raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    const entries = lines.map((line) => {
      const parts = line.split('|').map((p) => p.trim())
      const term = parts[0] ?? ''
      const definition = parts[1] ?? ''
      const tags = parts[2]
        ? parts[2]
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined
      return { term, definition, tags }
    })

    startTransition(async () => {
      try {
        const res = await bulkCreateVocabulary(entries)
        setResult(res)
        if (res.failed === 0) {
          setTimeout(() => {
            setOpen(false)
            setRaw('')
            setResult(null)
          }, 1500)
        }
      } catch {
        alert('Import failed')
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-ink-secondary hover:bg-border-subtle transition-colors"
      >
        <Upload size={16} />
        Bulk import
      </button>
    )
  }

  return (
    <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">
          Bulk import
        </h3>
        <button
          onClick={() => {
            setOpen(false)
            setRaw('')
            setResult(null)
          }}
          className="p-1 rounded-md text-ink-tertiary hover:text-ink hover:bg-border-subtle transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-sm text-ink-secondary">
        Paste one word per line. Format:{' '}
        <code className="px-1.5 py-0.5 rounded bg-border-subtle text-xs">
          term | definition | tag1, tag2
        </code>
      </p>

      <textarea
        rows={8}
        value={raw}
        maxLength={10_000}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={`serendipity | a happy accident | english, advanced\nephemeral | lasting for a very short time | english\nmellifluous | (of a voice or words) sweet or musical | english`}
        className="w-full px-3.5 py-2.5 rounded-lg bg-cream border border-border text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none font-mono"
      />

      {result && (
        <div
          className={`px-3.5 py-2.5 rounded-lg text-sm ${
            result.failed === 0
              ? 'bg-success-subtle text-success'
              : 'bg-accent-subtle text-accent'
          }`}
        >
          {result.created} imported
          {result.failed > 0 && `, ${result.failed} failed`}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleImport}
          disabled={isPending || !raw.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          <FileText size={16} />
          Import
        </button>
        <button
          onClick={() => {
            setRaw('')
            setResult(null)
          }}
          className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-ink-secondary hover:bg-border-subtle transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
