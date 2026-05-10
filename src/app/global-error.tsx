'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="min-h-dvh bg-cream flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-error-subtle flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-error" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-ink-secondary max-w-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <RotateCcw size={16} />
          Try again
        </button>
      </body>
    </html>
  )
}
