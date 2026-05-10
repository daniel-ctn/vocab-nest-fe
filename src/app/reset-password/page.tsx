'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Feather, Loader2, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/lib/auth-client'
import { ThemeToggle } from '@/components/theme-toggle'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      const result = await resetPassword({ newPassword: password })
      if (result.error) {
        setError(result.error.message || 'Failed to reset password')
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to reset password')
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
            Password reset
          </h1>
          <p className="text-sm text-ink-secondary mb-6">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Sign in
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
          Reset password
        </h1>
        <p className="text-sm text-ink-secondary text-center mb-8">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="••••••••"
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
            Reset password
          </button>
        </form>
      </div>
    </div>
  )
}
