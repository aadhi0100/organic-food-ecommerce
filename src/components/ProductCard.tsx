'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { WishlistButton } from './Wishlist'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/product/${product.id}`} className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <WishlistButton productId={product.id} />
          </div>
          {product.featured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              Featured
            </span>
          )}
          {product.organic && (
            <span className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Organic
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-white line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium dark:text-white">{product.rating}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatIndianCurrency(product.price)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
              aria-label="Add to cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
