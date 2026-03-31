'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token, newPassword: passwordForm.newPassword, confirmPassword: passwordForm.confirmPassword }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Unable to reset password')
      setMessage('Password updated successfully. Redirecting to login...')
      setTimeout(() => router.push('/login?reset=success'), 1200)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Set a new password"
      description="Use the secure reset link from your email to finish updating your password."
      footer={
        <div className="text-sm">
          <Link href="/login" className="font-semibold text-green-700 dark:text-green-400 hover:text-green-800">Back to login</Link>
        </div>
      }
    >
      {message && (
        <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">New password</span>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm((c) => ({ ...c, newPassword: event.target.value }))}
            className="min-h-[52px] rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900"
            autoComplete="new-password"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm password</span>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(event) => setPasswordForm((c) => ({ ...c, confirmPassword: event.target.value }))}
            className="min-h-[52px] rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900"
            autoComplete="new-password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 dark:bg-green-600 px-5 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </button>
      </form>
    </AuthShell>
  )
}
