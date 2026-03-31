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
    <label className="relative flex min-h-[44px] items-center rounded-lg border border-white/15 bg-white/10 pl-3 pr-2 text-white transition hover:bg-white/15">
      <Globe size={18} className="shrink-0 text-white/90" />
      <span className="sr-only">{t('selectLanguage')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="w-[5.5rem] appearance-none bg-transparent py-2 pl-2 pr-5 text-sm font-medium text-white outline-none sm:w-auto"
        aria-label={t('selectLanguage')}
      >
        {supportedLanguages.map((code) => (
          <option key={code} value={code} className="text-slate-900">
            {languageFlags[code]} {languageLabels[code]}
          </option>
        ))}
      </select>
    </label>
  )
}
