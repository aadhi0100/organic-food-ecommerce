'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Mail, Send } from 'lucide-react'

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setMessage(`✓ ${t('subscribed')}`)
        setEmail('')
      } else {
        setMessage(`✗ ${t('subscriptionFailed')}`)
      }
    } catch {
      setMessage(`✗ ${t('errorOccurred')}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center text-white">
          <Mail className="mx-auto mb-4" size={48} />
          <h3 className="mb-2 text-3xl font-bold">{t('subscribeNewsletter')}</h3>
          <p className="mb-6 text-green-100">{t('newsletterDesc')}</p>

          <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enterEmail')}
              required
              className="flex-1 rounded-lg px-4 py-3 text-gray-900 focus:ring-4 focus:ring-green-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-green-600 transition hover:bg-green-50 disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? t('sending') : t('subscribe')}
            </button>
          </form>

          {message && <p className="mt-4 text-sm font-medium">{message}</p>}

          <p className="text-xs text-green-200">
            {t('newsletterStorageNote')}
          </p>
        </div>
      </div>
    </div>
  )
}
