'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Loader, Mail, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

function translateApiMessage(message: string | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
  if (!message) return ''
  const known: Record<string, string> = {
    'Unable to request password reset': 'unableToRequestPasswordReset',
    'If an account exists, a password reset link has been sent.': 'ifAccountExistsResetLinkSent',
    'Invalid reset request': 'invalidResetRequest',
  }
  const key = known[message]
  return key ? t(key) : t(message)
}

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(translateApiMessage(payload?.error, t) || t('unableToRequestPasswordReset'))
      }
      setMessage(translateApiMessage(payload?.message, t) || t('ifAccountExistsResetLinkSent'))
    } catch (error) {
      setMessage(error instanceof Error ? translateApiMessage(error.message, t) || error.message : t('unableToRequestPasswordReset'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7,_#f8fafc_40%,_#eef7ef_100%)] dark:bg-none dark:bg-gray-950 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-4xl items-center">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 dark:border-gray-700 bg-white/90 dark:bg-gray-900 shadow-2xl backdrop-blur">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-green-50">
                  <ShieldCheck size={16} />
                  {t('secureReset')}
                </div>
                <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
                  {t('recoverAccessWithoutExposingYourPassword')}
                </h1>
                <p className="mt-4 max-w-lg text-lg text-green-100">
                  {t('sendSecureResetLinkDescription')}
                </p>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-xs uppercase tracking-[0.25em] text-green-700 dark:text-green-400">{t('forgotPassword')}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{t('requestResetLink')}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{t('enterEmailOrPhoneToReceiveResetLink')}</p>

              {message && (
                <div className="mt-6 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('emailOrPhoneNumber')}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 px-4 py-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                      placeholder={t('emailOrPhonePlaceholder')}
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 dark:bg-green-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      {t('sendingResetLink')}...
                    </>
                  ) : (
                    t('sendResetLink')
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link href="/login" className="font-semibold text-green-700 dark:text-green-400 hover:text-green-800">{t('backToLogin')}</Link>
                <Link href="/register" className="font-semibold text-green-700 dark:text-green-400 hover:text-green-800">{t('newAccount')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
