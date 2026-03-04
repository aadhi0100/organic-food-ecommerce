'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus, ShoppingBag, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        // Auto-login after registration
        await login(formData.email, formData.password)
        // Redirect to customer dashboard
        router.push('/dashboard/customer')
      } else {
        const data = await response.json()
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl text-white shadow-2xl">
          <div className="mb-8">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-5xl font-bold mb-4">{t('joinUs')}!</h1>
            <p className="text-blue-100 text-lg">Start your organic food journey</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Shop Organic Products</h3>
                <p className="text-blue-100 text-sm">Access 60+ certified organic products</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Earn Rewards</h3>
                <p className="text-blue-100 text-sm">Get up to 20% discount with loyalty tiers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{t('createAccount')}</h2>
            <p className="text-gray-600">Join our organic food community</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? `${t('createAccount')}...` : (
                <>
                  <UserPlus size={20} />
                  {t('createAccount')}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
