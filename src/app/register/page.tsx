'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Loader } from 'lucide-react'

export default function RegisterPage() {
  const { loginWithGoogle } = useAuth()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const nextPath = useMemo(() => {
    const next = searchParams.get('next') || '/dashboard/customer'
    return next.startsWith('/') ? next : '/dashboard/customer'
  }, [searchParams])

  const startGoogle = () => {
    setLoading(true)
    loginWithGoogle(nextPath)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 max-w-xl w-full relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{t('createAccount')}</h2>
          <p className="text-gray-600">Create your account using Google Sign-In</p>
        </div>

        <button
          type="button"
          onClick={startGoogle}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              {t('createAccount')}...
            </>
          ) : (
            'Continue with Google'
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('alreadyHaveAccount')}{' '}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}`}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

