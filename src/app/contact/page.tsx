'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest', name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, timestamp: new Date().toISOString() }),
      })
      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch {
      console.error('Failed to send message')
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-green-500'
  const labelCls = 'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-center text-5xl font-bold text-gray-900 dark:text-white">{t('contactUs')}</h1>
          <p className="mb-12 text-center text-xl text-gray-600 dark:text-gray-400">{t('getInTouch')}</p>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('getInTouch')}</h2>
              <div className="mb-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3"><Phone className="text-green-600 dark:text-green-400" size={24} /></div>
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{t('phone')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">+91 98765 43210</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{t('respondWithin24Hours')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3"><Mail className="text-blue-600 dark:text-blue-400" size={24} /></div>
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{t('email')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@organicfood.in</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{t('respondWithin24Hours')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3"><MapPin className="text-purple-600 dark:text-purple-400" size={24} /></div>
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{t('address')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">No. 12, Anna Salai, Teynampet</p>
                    <p className="text-gray-600 dark:text-gray-400">Chennai, Tamil Nadu 600018</p>
                    <p className="text-gray-600 dark:text-gray-400">India</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{t('businessHours')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('mondayFriday')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('saturday')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('sunday')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{t('closed')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('sendMessage')}</h2>
              {isSubmitted && (
                <div className="mb-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-700 dark:text-green-400">
                  {t('thankYouWeWillGetBackToYouSoon')}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>{t('name')}</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder={t('yourName')} />
                </div>
                <div>
                  <label className={labelCls}>{t('email')}</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder={t('yourEmail')} />
                </div>
                <div>
                  <label className={labelCls}>{t('subject')}</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputCls} placeholder={t('howCanWeHelp')} />
                </div>
                <div>
                  <label className={labelCls}>{t('message')}</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={inputCls + ' resize-none'} placeholder={t('yourMessage')} />
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700">
                  <Send size={20} />{t('sendMessage')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
