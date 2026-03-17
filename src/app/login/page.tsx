'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Loader, ShieldCheck, Fingerprint } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginWithGoogle } = useAuth()
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  const nextPath = useMemo(() => {
    const next = searchParams.get('next') || '/'
    return next.startsWith('/') ? next : '/'
  }, [searchParams])

  const startGoogle = () => {
    setLoading(true)
    setError('')
    try {
      loginWithGoogle(nextPath)
    } catch {
      setLoading(false)
      setError('Unable to start Google Sign-In')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl text-white shadow-2xl">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{t('welcomeBack')}!</h1>
            <p className="text-green-100 text-lg">Access your organic food marketplace</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Secure Authentication</h3>
                <p className="text-green-100 text-sm">Google Sign-In with verified tokens</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Fingerprint size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Multi-Role Access</h3>
                <p className="text-green-100 text-sm">Admin, Vendor, and Customer portals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{t('signIn')}</h2>
            <p className="text-gray-600">Continue with Google to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={startGoogle}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                {t('signIn')}...
              </>
            ) : (
              'Continue with Google'
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link
                href={`/register?next=${encodeURIComponent(nextPath)}`}
                className="text-green-600 font-medium hover:text-green-700"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

