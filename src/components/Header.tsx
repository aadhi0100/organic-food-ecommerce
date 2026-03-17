'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { ShoppingCart, User, Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { LanguageSelector } from './LanguageSelector'

export function Header() {
  const { getItemCount } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition">
            <span className="text-3xl">🌿</span>
            <span>{t('organicFood')}</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="hover:text-green-200 transition">{t('products')}</Link>
            <Link href="/about" className="hover:text-green-200 transition">{t('about')}</Link>
            <Link href="/contact" className="hover:text-green-200 transition">{t('contact')}</Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <button 
              onClick={toggleTheme}
              className="hover:text-green-200 transition p-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <Link href="/cart" className="relative hover:text-green-200 transition">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href={
                    user.role === 'admin' ? '/dashboard/admin' :
                    user.role === 'vendor' ? '/dashboard/vendor' :
                    '/dashboard/customer'
                  } 
                  className="hover:text-green-200 transition flex items-center gap-1"
                >
                  <User size={20} />
                  <span className="hidden md:inline">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-sm hover:text-green-200 transition">{t('logout')}</button>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium">
                {t('login')}
              </Link>
            )}
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </nav>
        
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/products" className="block py-2 hover:text-green-200">{t('products')}</Link>
            <Link href="/about" className="block py-2 hover:text-green-200">{t('about')}</Link>
            <Link href="/contact" className="block py-2 hover:text-green-200">{t('contact')}</Link>
          </div>
        )}
      </div>
    </header>
  )
}
