'use client'

import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ]

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition">
        <Globe size={20} />
        <span className="hidden sm:inline">{languages.find(l => l.code === language)?.flag}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-56 bg-black text-white rounded-lg shadow-2xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors ${
              language === lang.code ? 'bg-gray-700' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="font-medium text-white">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
