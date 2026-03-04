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
        body: JSON.stringify({
          userId: 'guest',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Failed to send message')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6">{t('contactUs')}</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          {t('getInTouch')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('getInTouch')}</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('phone')}</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9am-6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('email')}</h3>
                  <p className="text-gray-600">info@organicfood.in</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t('address')}</h3>
                  <p className="text-gray-600">123 MG Road, Koramangala</p>
                  <p className="text-gray-600">Bangalore, Karnataka 560034</p>
                  <p className="text-gray-600">India</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3">{t('businessHours')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
            
            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('message')}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {t('sendMessage')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
