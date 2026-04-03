'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, Eye, EyeOff, Loader, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { AuthShell } from '@/components/auth/AuthShell'
import { getDashboardPath, hasCompletedOnboarding, sanitizeNextPath } from '@/lib/auth/routing'
import type { User as AppUser } from '@/types'

function translateApiMessage(message: string | undefined, t: (key: string, params?: Record<string, string | number>) => string) {
  if (!message) return ''
  const known: Record<string, string> = {
    'Unable to start Google Sign-In': 'unableToStartGoogleSignIn',
    'Unable to save profile': 'unableToSaveProfile',
    'Unable to save password': 'unableToSavePassword',
    'Please sign in with Google first': 'pleaseSignInWithGoogleFirst',
    'Profile saved. Set a password so you can sign in with email or phone later.': 'profileSavedSetPassword',
    'Profile created successfully': 'profileCreatedSuccessfully',
    'Password created successfully': 'passwordCreatedSuccessfully',
    'An account with this email already exists': 'accountAlreadyExists',
    'Registration failed': 'registrationFailed',
  }
  const key = known[message]
  return key ? t(key) : message
}

export default function RegisterPage() {
  const { user, isLoading, loginWithGoogle, refreshSession } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()

  const [tab, setTab] = useState<'email' | 'google'>('email')
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Google profile form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })

  // Email registration form
  const [emailForm, setEmailForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showEmailPw, setShowEmailPw] = useState(false)
  const [showEmailConfirmPw, setShowEmailConfirmPw] = useState(false)

  const nextPath = useMemo(() => sanitizeNextPath(searchParams.get('next'), '/dashboard'), [searchParams])

  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setPhone(user.phone || '')
      setAddress(user.address || '')
      setPhotoPreview(user.profilePhoto || user.picture || '')
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && user && hasCompletedOnboarding(user)) {
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

  const handleEmailRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    if (emailForm.password !== emailForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoadingSubmit(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/auth/register-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(emailForm),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(translateApiMessage(payload?.error, t))
      await refreshSession()

      const destination = nextPath === '/dashboard' ? getDashboardPath((payload?.user?.role as AppUser['role'] | undefined) || 'customer') : nextPath
      router.replace(destination)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registrationFailed'))
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleGoogleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoadingSubmit(true)
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      formData.set('name', fullName)
      formData.set('phone', phone)
      formData.set('address', address)
      if (photoFile) formData.set('profilePhoto', photoFile)

      const response = await fetch('/api/auth/register', { method: 'POST', body: formData, credentials: 'include' })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(translateApiMessage(payload?.error || payload?.message, t) || t('unableToSaveProfile'))

      await refreshSession()

      if (user?.authProvider === 'google' || user?.authProvider === undefined) {
        setShowPasswordPrompt(true)
        setSuccess(t('profileSavedSetPassword'))
        return
      }

      setSuccess(t('profileCreatedSuccessfully'))
      const destination = nextPath === '/dashboard' ? getDashboardPath((payload?.user?.role as AppUser['role'] | undefined) || user?.role) : nextPath
      router.replace(destination)
    } catch (err) {
      setError(err instanceof Error && err.message ? translateApiMessage(err.message, t) || err.message : t('unableToSaveProfile'))
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handlePasswordSetup = async () => {
    setPasswordLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword: passwordForm.newPassword, confirmPassword: passwordForm.confirmPassword }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(translateApiMessage(payload?.error || payload?.message, t) || t('unableToSavePassword'))

      await refreshSession()
      setSuccess(t('passwordCreatedSuccessfully'))
      const destination = nextPath === '/dashboard' ? getDashboardPath((payload?.user?.role as AppUser['role'] | undefined) || user?.role) : nextPath
      router.replace(destination)
    } catch (err) {
      setError(err instanceof Error && err.message ? translateApiMessage(err.message, t) || err.message : t('unableToSavePassword'))
    } finally {
      setPasswordLoading(false)
    }
  }

  const showGoogleProfileForm = tab === 'google' && !!user

  return (
    <AuthShell
      eyebrow={t('registration')}
      title={showGoogleProfileForm ? t('completeYourAccount') : t('createAccount')}
      description={t('registrationSubtitle')}
      footer={
        <p className="text-center text-sm text-gray-500">
          {t('alreadyCompletedThisStepGoToLogin')}{' '}
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="font-semibold text-green-700 hover:text-green-800 transition">
            {t('signIn')}
          </Link>
        </p>
      }
    >
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">✓</span>
          {success}
        </div>
      )}

      {!showGoogleProfileForm && (
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => { setTab('email'); setError(''); setSuccess('') }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setTab('google'); setError(''); setSuccess('') }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === 'google' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Google
          </button>
        </div>
      )}

      {/* Email + Password Registration */}
      {tab === 'email' && !showGoogleProfileForm && (
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{t('fullName')}</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={emailForm.name}
                onChange={(e) => setEmailForm((c) => ({ ...c, name: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder={t('enterFullName')}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm((c) => ({ ...c, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={emailForm.phone}
                onChange={(e) => setEmailForm((c) => ({ ...c, phone: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder={t('phonePlaceholder')}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showEmailPw ? 'text' : 'password'}
                value={emailForm.password}
                onChange={(e) => setEmailForm((c) => ({ ...c, password: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder={t('enterPassword')}
                autoComplete="new-password"
                required
              />
              <button type="button" onClick={() => setShowEmailPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showEmailPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{t('confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showEmailConfirmPw ? 'text' : 'password'}
                value={emailForm.confirmPassword}
                onChange={(e) => setEmailForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                placeholder={t('confirmPassword')}
                autoComplete="new-password"
                required
              />
              <button type="button" onClick={() => setShowEmailConfirmPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showEmailConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingSubmit ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                {t('creatingAccount')}...
              </>
            ) : (
              t('createAccount')
            )}
          </button>
        </form>
      )}

      {/* Google Sign-In Tab */}
      {tab === 'google' && !user && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={startGoogle}
            disabled={loadingGoogle || isLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingGoogle || isLoading ? (
              <Loader className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loadingGoogle || isLoading ? `${t('continueWithGoogle')}...` : t('continueWithGoogle')}
          </button>
        </div>
      )}

      {/* Google profile completion form */}
      {showGoogleProfileForm && (
        <>
          <form onSubmit={handleGoogleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder={t('enterFullName')}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">{t('phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder={t('phonePlaceholder')}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">{t('address')}</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 pt-2.5 pb-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  placeholder={t('addressPlaceholder')}
                  autoComplete="street-address"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">{t('profilePhoto')}</label>
              <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm font-medium text-gray-500 transition hover:bg-gray-100">
                <Camera className="h-4 w-4 shrink-0" />
                <span className="truncate">{photoFile ? photoFile.name : t('uploadProfilePhoto')}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setPhotoFile(file)
                    if (file) setPhotoPreview(URL.createObjectURL(file))
                  }}
                />
              </label>
            </div>

            {photoPreview && (
              <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={photoPreview} alt={t('profilePreview')} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">{t('profilePreview')}</p>
                  <p className="text-xs text-green-600">{t('profilePreviewHint')}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingSubmit}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingSubmit ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {t('savingProfile')}...
                </>
              ) : (
                t('saveProfile')
              )}
            </button>
          </form>

          {showPasswordPrompt && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">{t('passwordSetup')}</p>
                  <h3 className="mt-0.5 text-lg font-bold text-green-950">{t('createYourPassword')}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => router.replace(nextPath === '/dashboard' ? getDashboardPath(user!.role) : nextPath)}
                  className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                >
                  {t('skipForNow')}
                </button>
              </div>

              <p className="text-sm text-green-800">{t('passwordSetupHint')}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder={t('newPassword')}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((c) => ({ ...c, newPassword: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-green-200 bg-white pr-10 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder={t('confirmPassword')}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-green-200 bg-white pr-10 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePasswordSetup}
                disabled={passwordLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {t('savingPassword')}...
                  </>
                ) : (
                  t('savePasswordAndContinue')
                )}
              </button>
            </div>
          )}
        </>
      )}
    </AuthShell>
  )
}
