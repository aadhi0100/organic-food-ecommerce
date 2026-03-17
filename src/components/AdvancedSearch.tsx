'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  categories?: string[]
}

export interface SearchFilters {
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest'
}

export function AdvancedSearch({ onSearch, categories = [] }: AdvancedSearchProps) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    sortBy: 'name'
  })

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      inStock: false,
      sortBy: 'name'
    })
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('searchProducts')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('search')}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold dark:text-white">{t('filters')}</h3>
                <button onClick={resetFilters} className="text-sm text-green-600 hover:underline">
                  {t('resetAll')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">{t('category')}</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">{t('allCategories')}</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">{t('minPrice')} (₹)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">{t('maxPrice')} (₹)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-white">{t('sortBy')}</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="name">{t('nameSort')}</option>
                    <option value="price-low">{t('priceLowToHigh')}</option>
                    <option value="price-high">{t('priceHighToLow')}</option>
                    <option value="newest">{t('newestFirst')}</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm dark:text-white">{t('inStockOnly')}</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
