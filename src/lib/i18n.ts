import en from '@/locales/en.json'
import hi from '@/locales/hi.json'
import ta from '@/locales/ta.json'
import te from '@/locales/te.json'
import bn from '@/locales/bn.json'
import mr from '@/locales/mr.json'
import gu from '@/locales/gu.json'
import kn from '@/locales/kn.json'
import ml from '@/locales/ml.json'
import pa from '@/locales/pa.json'

// Extend window type for development utilities
declare global {
  interface Window {
    __missingTranslations?: Record<string, string[]>
  }
}

export const supportedLanguages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'] as const

export type Language = (typeof supportedLanguages)[number]

export const LANGUAGE_COOKIE_NAME = 'organic-food-language'
export const DEFAULT_LANGUAGE: Language = 'en'

export const localeMessages: Record<Language, Record<string, string>> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
  gu,
  kn,
  ml,
  pa,
}

export const languageLabels: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
}

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  ta: '🇮🇳',
  te: '🇮🇳',
  bn: '🇮🇳',
  mr: '🇮🇳',
  gu: '🇮🇳',
  kn: '🇮🇳',
  ml: '🇮🇳',
  pa: '🇮🇳',
}

export const languageFontClasses: Record<Language, string> = {
  en: 'font-sans',
  hi: 'font-hindi',
  ta: 'font-tamil',
  te: 'font-telugu',
  bn: 'font-bengali',
  mr: 'font-marathi',
  gu: 'font-gujarati',
  kn: 'font-kannada',
  ml: 'font-malayalam',
  pa: 'font-punjabi',
}

const translationCache = new Map<string, string>()
const loggedMissingKeys = new Set<string>()

function resolvePath(messages: Record<string, unknown>, key: string): unknown {
  if (!key.includes('.')) {
    return messages[key]
  }

  return key.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, messages)
}

function interpolate(value: string, params?: Record<string, string | number>) {
  if (!params) return value

  return value.replace(/\{\{(\w+)\}\}/g, (match, token) => {
    const replacement = params[token]
    return replacement === undefined ? match : String(replacement)
  })
}

function logMissingKey(language: Language, key: string) {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV === 'production') return

  const cacheKey = `${language}:${key}`
  if (loggedMissingKeys.has(cacheKey)) return

  loggedMissingKeys.add(cacheKey)
  console.warn(
    `[i18n] Missing translation key "${key}" for "${language}". ` +
    `Fallback to English will be used. Add this key to src/locales/${language}.json`
  )

  // Track missing keys for developer awareness
  if (typeof window !== 'undefined' && window.__missingTranslations) {
    if (!window.__missingTranslations[language]) {
      window.__missingTranslations[language] = []
    }
    if (!window.__missingTranslations[language].includes(key)) {
      window.__missingTranslations[language].push(key)
    }
  }
}

export function normalizeLanguage(value?: string | null): Language {
  if (!value) return DEFAULT_LANGUAGE
  return (supportedLanguages as readonly string[]).includes(value) ? (value as Language) : DEFAULT_LANGUAGE
}

export function getLocaleMessages(language: Language) {
  return localeMessages[language] || localeMessages.en
}

export function createTranslator(language: Language) {
  const cacheKey = language
  const localeMessagesForLanguage = getLocaleMessages(language)
  const fallbackMessages = localeMessages.en

  return (key: string, params?: Record<string, string | number>) => {
    const translationCacheKey = `${cacheKey}:${key}:${params ? JSON.stringify(params) : ''}`
    const cached = translationCache.get(translationCacheKey)
    if (cached) return cached

    // Try to get translation for current language
    const rawValue = resolvePath(localeMessagesForLanguage, key)
    
    // If not found in current language, try English (fallback)
    const fallbackValue = rawValue ?? resolvePath(fallbackMessages, key)
    
    if (typeof fallbackValue !== 'string') {
      logMissingKey(language, key)
      return key
    }

    // Log if using fallback (English translation for non-English request)
    if (language !== 'en' && !rawValue && fallbackValue) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.debug(`[i18n] Using English fallback for "${key}" in "${language}"`)
      }
    }

    const translated = interpolate(fallbackValue as string, params)
    translationCache.set(translationCacheKey, translated)
    return translated
  }
}

export function clearTranslationCache() {
  translationCache.clear()
}

