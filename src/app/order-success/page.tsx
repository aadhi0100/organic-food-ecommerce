'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useSearchParams } from 'next/navigation'

function OrderSuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl text-center">
          <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">{t('orderSuccess')}!</h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">{t('thankYouOrder')}</p>

          {orderId && (
            <div className="mb-8 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5 text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-green-700 dark:text-green-400">{t('orderReference')}</p>
              <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-300">{orderId}</p>
            </div>
          )}

          <div className="mb-8 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
            <Package size={48} className="mx-auto mb-4 text-green-600" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t('whatsNext')}</h2>
            <ul className="mx-auto max-w-md space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">1.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('orderConfirmationEmail')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">2.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('prepareYourFreshProducts')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">3.</span>
                <span className="text-gray-700 dark:text-gray-300">{t('deliveryWithin24To48Hours')}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700">
              <Home size={20} />{t('home')}
            </Link>
            {orderId && (
              <Link href={`/invoice/${orderId}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-green-600 px-8 py-3 font-bold text-green-600 dark:text-green-400 dark:border-green-500 transition hover:bg-green-50 dark:hover:bg-green-900/20">
                {t('viewInvoice')}
              </Link>
            )}
            {orderId && (
              <a href={`/api/orders/${orderId}/invoice`} download={`Invoice-${orderId}.pdf`} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700">
                ↓ {t('downloadPdf')}
              </a>
            )}
            {orderId && (
              <Link href={`/track-order/${orderId}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-800 dark:border-slate-400 px-8 py-3 font-bold text-slate-800 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                {t('trackOrder')}
              </Link>
            )}
            <Link href="/products" className="inline-flex items-center gap-2 rounded-lg border-2 border-green-600 px-8 py-3 font-bold text-green-600 dark:text-green-400 dark:border-green-500 transition hover:bg-green-50 dark:hover:bg-green-900/20">
              {t('continueShopping')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center dark:bg-gray-900"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
