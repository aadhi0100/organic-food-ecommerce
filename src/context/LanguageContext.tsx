'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { allTranslations } from '@/utils/translations'

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  fontClass: string
}

const translations = allTranslations as Record<Language, Record<string, string>>

const fontClasses: Record<Language, string> = {
  en: 'font-sans',
  hi: 'font-hindi',
  ta: 'font-sans',
  te: 'font-sans',
  bn: 'font-sans',
  mr: 'font-sans',
  gu: 'font-sans',
  kn: 'font-sans',
  ml: 'font-sans',
  pa: 'font-sans',
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language
    const validLanguages: Language[] = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa']
    if (stored && validLanguages.includes(stored)) {
      setLanguage(stored)
      document.documentElement.lang = stored
      document.body.className = fontClasses[stored]
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.body.className = fontClasses[lang]
  }

  const t = (key: string) => translations[language]?.[key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, fontClass: fontClasses[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
