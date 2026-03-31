'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createTranslator,
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  languageFontClasses,
  normalizeLanguage,
  type Language,
  clearTranslationCache,
} from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof createTranslator>
  fontClass: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function applyLanguageToDocument(language: Language) {
  if (typeof document === 'undefined') return

  const fontClass = languageFontClasses[language]
  const allFontClasses = Object.values(languageFontClasses)

  document.documentElement.lang = language
  document.documentElement.dir = 'ltr'
  document.body.classList.remove(...allFontClasses)
  document.body.classList.add(fontClass)
}

function persistLanguage(language: Language) {
  if (typeof window === 'undefined') return

  localStorage.setItem('language', language)
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    const stored = localStorage.getItem('language')
    if (stored) {
      const normalized = normalizeLanguage(stored)
      if (normalized !== language) {
        setLanguageState(normalized)
      }
      return
    }

    applyLanguageToDocument(language)
  }, [language])

  useEffect(() => {
    applyLanguageToDocument(language)
  }, [])

  const changeLanguage = (nextLanguage: Language) => {
    clearTranslationCache()
    setLanguageState(nextLanguage)
    persistLanguage(nextLanguage)
    applyLanguageToDocument(nextLanguage)
  }

  const t = createTranslator(language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, fontClass: languageFontClasses[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
