'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { AuthShell } from '@/components/auth/AuthShell'
import { getDashboardPath, sanitizeNextPath } from '@/lib/auth/routing'
import type { User } from '@/types'

const AUTH_ERROR_MESSAGE = 'Google sign-in could not be completed. Please try again.'

function translateApiMessage(message: string | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
  if (!message) return ''
  const known: Record<string, string> = {
    'Invalid credentials': 'invalidCredentials',
    'Password login failed': 'passwordLoginFailed',
    'Unable to start Google Sign-In': 'unableToStartGoogleSignIn',
    'Google sign-in could not be completed. Please try again.': 'unableToStartGoogleSignIn',
  }
  const key = known[message]
  return key ? t(key) : t(message)
}

export default function LoginPage() {
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [error, setError] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { user, isLoading, loginWithGoogle, refreshSession } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'
  const nextPath = useMemo(() => sanitizeNextPath(searchParams.get('next'), '/dashboard'), [searchParams])
  const authError = searchParams.get('error')

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDashboardPath(user.role))
    }
  }, [isLoading, router, user])

  const startGoogle = () => {
    setLoadingGoogle(true)
    setError('')
    try {
      loginWithGoogle(nextPath)
    } catch {
      setLoadingGoogle(false)
      setError(t('unableToStartGoogleSignIn'))
    }
  }

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoadingPassword(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(translateApiMessage(payload?.error || payload?.message, t) || t('invalidCredentials'))
      }
      await refreshSession()
      const nextRole = (payload?.user?.role as User['role'] | undefined) || user?.role
      const destination = nextPath === '/dashboard' ? getDashboardPath(nextRole) : nextPath
      router.replace(destination)
    } catch (err) {
      setError(err instanceof Error && err.message ? translateApiMessage(err.message, t) || err.message : t('passwordLoginFailed'))
    } finally {
      setLoadingPassword(false)
    }
  }

  const resolvedError = error || (authError ? AUTH_ERROR_MESSAGE : '')

  return (
    <AuthShell
      eyebrow={t('welcomeBack')}
      title={t('signIn')}
      description={t('loginSubtitle')}
      footer={
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('dontHaveAccount')}{' '}
          <Link href={`/register?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-green-700 dark:text-green-400 hover:text-green-800 transition">
            {t('signUp')}
          </Link>
        </p>
      }
    >
      {resolvedError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
          {translateApiMessage(resolvedError, t) || resolvedError}
        </div>
      )}

      {resetSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <span className="h-4 w-4 shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
          {t('passwordResetSuccess')}
        </div>
      )}

      {/* Google button */}
      <button
        type="button"
        onClick={startGoogle}
        disabled={loadingGoogle}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingGoogle ? (
          <Loader className="h-4 w-4 animate-spin text-gray-400" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {loadingGoogle ? `${t('signingIn')}...` : t('continueWithGoogle')}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('orSignInWithPassword')}</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Password form */}
      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('username')}
            <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">({t('emailOrPhone')})</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="john@example.com / +91 9876543210"
              className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('password')}</label>
            <Link href="/forgot-password" className="text-xs font-medium text-green-700 dark:text-green-400 hover:text-green-800 transition">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-11 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingPassword}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingPassword ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              {t('signingIn')}...
            </>
          ) : (
            t('signInWithPassword')
          )}
        </button>
      </form>

      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {t('completeProfilePrompt')}{' '}
        <Link href="/register?next=%2Fdashboard" className="font-semibold text-green-700 dark:text-green-400 hover:text-green-800 transition">
          {t('completeRegistration')}
        </Link>
      </div>
    </AuthShell>
  )
}
