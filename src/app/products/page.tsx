'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch'
import { LoadingScreen, MiniLoader } from '@/components/LoadingScreen'
import type { Product } from '@/types'
import { motion } from 'framer-motion'

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grains', 'Pantry', 'Beverages', 'Snacks', 'Spices']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFilteredProducts(data)
        setIsLoading(false)
      })
  }, [])

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = [...products]
    
    if (query && query.trim()) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    
    filtered = filtered.filter(p => 
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    )
    
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0)
    }
    
    if (filters.sortBy === 'price-low') {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-high') {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filters.sortBy === 'newest') {
      filtered = filtered.reverse()
    }
    
    setFilteredProducts(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 dark:text-white">Our Products</h1>
        <p className="text-gray-600 dark:text-gray-400">Fresh organic products delivered to your door</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <AdvancedSearch onSearch={handleSearch} categories={categories} />
      </motion.div>

      {isLoading ? (
        <LoadingScreen />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}
