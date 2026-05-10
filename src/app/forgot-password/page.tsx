'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Feather, Loader2, CheckCircle } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth-client'
import { ThemeToggle } from '@/components/theme-toggle'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      })
      if (result.error) {
        setError(result.error.message || 'Failed to send reset link')
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to send reset link')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle className="p-2 rounded-lg text-ink-secondary hover:bg-border-subtle hover:text-ink transition-colors" />
        </div>
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white">
              <Feather size={18} strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-semibold text-ink tracking-tight">
              Vocab Nest
            </span>
          </div>

          <div className="w-14 h-14 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-success" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Check your email
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            If an account exists for {email}, we&apos;ve sent a password reset
            link.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle className="p-2 rounded-lg text-ink-secondary hover:bg-border-subtle hover:text-ink transition-colors" />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white">
            <Feather size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-semibold text-ink tracking-tight">
            Vocab Nest
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink text-center mb-2">
          Forgot password?
        </h1>
        <p className="text-sm text-ink-secondary text-center mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-lg bg-error-subtle text-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Send reset link
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-secondary text-center">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
