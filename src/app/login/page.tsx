'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Loader, ShieldCheck, Fingerprint } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const userData = await res.json()
      
      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (userData.role === 'vendor') {
        router.push('/dashboard/vendor')
      } else if (userData.role === 'customer') {
        router.push('/dashboard/customer')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (role: string) => {
    const credentials = {
      admin: { email: 'admin@organic.com', password: 'admin123' },
      vendor: { email: 'vendor@organic.com', password: 'vendor123' },
      customer: { email: 'customer@organic.com', password: 'customer123' }
    }
    const cred = credentials[role as keyof typeof credentials]
    setEmail(cred.email)
    setPassword(cred.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl text-white shadow-2xl">
          <div className="mb-8">
            <div className="text-6xl mb-4">🌿</div>
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
                <p className="text-green-100 text-sm">Your data is protected with enterprise-grade security</p>
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
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  {t('signIn')}...
                </>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Quick Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => quickLogin('admin')}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-sm font-medium"
              >
                👨‍💼 Admin
              </button>
              <button
                onClick={() => quickLogin('vendor')}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-sm font-medium"
              >
                🏪 Vendor
              </button>
              <button
                onClick={() => quickLogin('customer')}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-sm font-medium"
              >
                🛒 Customer
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link href="/register" className="text-green-600 font-medium hover:text-green-700">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
