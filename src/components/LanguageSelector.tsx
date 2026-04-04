'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  languageFlags,
  languageLabels,
  supportedLanguages,
  type Language,
} from '@/lib/i18n'

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <label className="relative flex min-h-[44px] items-center rounded-lg border border-gray-200 bg-white pl-3 pr-2 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
      <Globe size={18} className="shrink-0" />
      <span className="sr-only">{t('selectLanguage')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="w-[5.5rem] appearance-none bg-transparent py-2 pl-2 pr-5 text-sm font-medium text-gray-600 outline-none dark:text-gray-300 sm:w-auto"
        aria-label={t('selectLanguage')}
      >
        {supportedLanguages.map((code) => (
          <option key={code} value={code} className="bg-white text-slate-900 dark:bg-gray-800 dark:text-gray-100">
            {languageFlags[code]} {languageLabels[code]}
          </option>
        ))}
      </select>
    </label>
  )
}
