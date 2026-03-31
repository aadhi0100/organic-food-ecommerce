'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import type { SearchFilters } from '@/components/AdvancedSearch'
import { SkeletonCard } from '@/components/SkeletonLoader'
import { useLanguage } from '@/context/LanguageContext'
import { translateProducts } from '@/utils/productTranslate'
import type { Product } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grains', 'Pantry', 'Beverages', 'Snacks', 'Spices', 'Nuts', 'Seeds', 'Oils', 'Pulses']
const PAGE_SIZE = 12

export default function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { t, language } = useLanguage()

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const translated = translateProducts(data, language)
        setProducts(translated)
        setFilteredProducts(translated)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [language])

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = [...products]

    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    if (filters.category) filtered = filtered.filter((p) => p.category === filters.category)

    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= (filters.maxPrice === 1000 ? Infinity : filters.maxPrice),
    )

    if (filters.inStock) filtered = filtered.filter((p) => p.stock > 0)

    if (filters.sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price)
    else if (filters.sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price)
    else if (filters.sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
    else if (filters.sortBy === 'newest') filtered.reverse()

    setFilteredProducts(filtered)
    setPage(1)
  }

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginated = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (n: number) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('products')}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {isLoading ? 'Loading products…' : `${filteredProducts.length} certified organic products`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <AdvancedSearch onSearch={handleSearch} categories={CATEGORIES} />
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Package size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">{t('noProductsFound')}</h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
            <button
              onClick={() => handleSearch('', { category: '', minPrice: 0, maxPrice: 5000, inStock: false, sortBy: 'name' })}
              className="btn-primary rounded-full px-6 py-2.5 text-sm"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Products grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {paginated.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === 'number' && (n as number) - (arr[idx - 1] as number) > 1)
                        acc.push('...')
                      acc.push(n)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`e-${idx}`} className="px-2 py-2 text-gray-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goToPage(item as number)}
                          className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                            page === item
                              ? 'bg-green-600 text-white shadow'
                              : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800'
                          }`}
                        >
                          {item}
                        </button>
                      ),
                    )}
                </div>

                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
