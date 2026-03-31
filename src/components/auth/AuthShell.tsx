'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, Leaf, ShieldCheck, Truck, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  highlights?: { title: string; description: string }[]
  footer?: ReactNode
}

const BRAND_FEATURES = [
  { icon: Leaf, text: '100% Certified Organic Products' },
  { icon: Truck, text: 'Fresh Delivery Across India' },
  { icon: Star, text: 'Trusted by 50,000+ Customers' },
  { icon: ShieldCheck, text: 'Secure & Private Checkout' },
]

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-12 py-10 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur group-hover:bg-white/30 transition">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Organic Food</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-200 mb-3">{eyebrow}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight">{title}</h2>
            <p className="mt-4 text-base leading-7 text-green-100/90">{description}</p>
          </div>

          <div className="space-y-3">
            {BRAND_FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-green-50">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-green-200/70">© {new Date().getFullYear()} Organic Food. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t('secureAccess')}</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile brand header */}
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-gray-900 dark:text-white">Organic Food</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-600 mb-1">{eyebrow}</p>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>

            {/* Desktop heading */}
            <div className="mb-8 hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-600 mb-1">{eyebrow}</p>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">{title}</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>

            <div className="space-y-5">{children}</div>

            {footer && (
              <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
