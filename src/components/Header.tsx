'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Moon, Search, Settings2, ShoppingCart, Sun, User, X, ChevronDown, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { OrganiLogo } from './OrganiLogo'

const NAV_LINKS = [
  { href: '/products', labelKey: 'products', icon: '🛒' },
  { href: '/about', labelKey: 'about', icon: '🌿' },
  { href: '/contact', labelKey: 'contact', icon: '📞' },
]

const CATEGORY_LINKS = [
  { name: 'Fruits', href: '/products?category=Fruits', icon: '🍎' },
  { name: 'Vegetables', href: '/products?category=Vegetables', icon: '🥦' },
  { name: 'Dairy', href: '/products?category=Dairy', icon: '🥛' },
  { name: 'Grains', href: '/products?category=Grains', icon: '🌾' },
  { name: 'Spices', href: '/products?category=Spices', icon: '🌶️' },
  { name: 'Nuts', href: '/products?category=Nuts', icon: '🥜' },
]

export function Header() {
  const { getItemCount } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const itemCount = getItemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const dashboardHref =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'vendor'
        ? '/dashboard/vendor'
        : '/dashboard/customer'

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 py-1.5 text-center text-xs font-medium text-white">
        <span className="animate-pulse mr-1">🌿</span>
        Free delivery on orders above ₹499 · Use code{' '}
        <span className="rounded bg-white/20 px-1.5 py-0.5 font-bold tracking-wide">ORGANIC10</span>{' '}
        for 10% off your first order
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95'
            : 'bg-white shadow-sm dark:bg-gray-900'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between gap-3 py-3 sm:py-3.5" aria-label="Main navigation">
            <OrganiLogo href="/" variant="dark" size="md" />

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400 ${
                    pathname === href
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t(labelKey)}
                  {pathname === href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-green-600"
                    />
                  )}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400">
                  Categories <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                    >
                      {CATEGORY_LINKS.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-900/20"
                        >
                          <span className="text-lg">{cat.icon}</span>
                          {cat.name}
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-gray-100 pt-1 dark:border-gray-700">
                        <Link
                          href="/products"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                        >
                          <Leaf size={14} /> View All Products
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 dark:border-green-700 dark:bg-green-900/20">
                      <Search size={14} className="text-green-600 dark:text-green-400" />
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-white"
                      />
                      <button type="button" onClick={() => setSearchOpen(false)}>
                        <X size={14} className="text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSearchOpen(true)}
                    className="touch-target inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </motion.button>
                )}
              </AnimatePresence>

              <LanguageSelector />

              <button
                onClick={toggleTheme}
                className="touch-target inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={t('toggleTheme')}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <Link
                href="/cart"
                className="touch-target relative inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={`${t('cart')} (${itemCount} items)`}
              >
                <ShoppingCart size={22} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <div className="hidden items-center gap-1.5 md:flex">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                      {user.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="max-w-[7rem] truncate">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg px-2 py-1.5 text-xs text-gray-500 transition hover:text-red-500 dark:text-gray-400"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-green-700 dark:text-gray-300"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="touch-target inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
                aria-label={isMenuOpen ? 'Close menu' : t('menuToggle')}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-4 md:hidden"
              >
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mb-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                    <Search size={16} className="text-gray-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search organic products..."
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none dark:text-white"
                    />
                  </div>
                </form>

                <div className="space-y-1">
                  {NAV_LINKS.map(({ href, labelKey, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        pathname === href
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{icon}</span> {t(labelKey)}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link href={dashboardHref} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                        <User size={16} /> {t('dashboard')}
                      </Link>
                      <Link href="/profile/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                        <Settings2 size={16} /> {t('profileSettings')}
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        {t('logout')}
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <Link href="/login" className="flex-1 rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-700">
                        {t('login')}
                      </Link>
                      <Link href="/register" className="flex-1 rounded-xl bg-green-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700">
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}
