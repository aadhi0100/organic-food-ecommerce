'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Star, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { formatIndianCurrency } from '@/utils/indianFormat'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/context/LanguageContext'
import { useNotification } from '@/context/NotificationContext'
import { WishlistButton } from './Wishlist'
import { SafeImage } from '@/components/SafeImage'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { t } = useLanguage()
  const { notify } = useNotification()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding || product.stock <= 0) return
    setIsAdding(true)
    try {
      const success = await addItem(product, 1)
      if (success) {
        notify('success', t('addedToCartMessage', { name: product.name }))
      } else {
        notify('error', t('addToCartFailed', { name: product.name }))
      }
    } finally {
      setIsAdding(false)
    }
  }

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:ring-green-500/50 dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-green-400/50">
        
        {/* Real Product Image Container */}
        <Link href={`/product/${product.id}`} className="relative block h-52 w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          <div className="absolute left-2 top-2 z-20 flex flex-col gap-1.5">
            {product.featured && (
              <span className="flex items-center gap-1 w-max rounded-full bg-amber-400/90 px-2.5 py-1 text-xs font-bold text-amber-900 backdrop-blur-md shadow-sm">
                <Star size={10} className="fill-amber-900 text-amber-900" /> {t('featured')}
              </span>
            )}
            {product.organic && (
              <span className="flex items-center gap-1 w-max rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                🌿 100% {t('organic')}
              </span>
            )}
          </div>
            
          <div className="absolute top-2 right-2 z-20 hover:scale-105 transition-transform">
            <WishlistButton productId={product.id} />
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/product/${product.id}`} className="mb-2 block">
            <h3 className="line-clamp-1 text-xl font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
              {product.name}
            </h3>
          </Link>

          <p className="line-clamp-2 min-h-[2.5rem] flex-1 text-sm text-gray-500 dark:text-gray-400">
            {product.description}
          </p>

          <div className="my-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                  }
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-gray-400">({product.reviews})</span>
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex flex-col">
              {isLowStock && !isOutOfStock && (
                <span className="mb-1 text-[10px] font-bold uppercase text-orange-500">
                  ⚠️ {t('lowStock') || 'Low Stock'}
                </span>
              )}
              {isOutOfStock && (
                <span className="mb-1 text-[10px] font-bold uppercase text-red-500">
                  ❌ {t('outOfStock')}
                </span>
              )}
              <span className="text-2xl font-black tracking-tight text-green-600 dark:text-green-400">
                {formatIndianCurrency(product.price)}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
                <Package size={12} />
                {isOutOfStock ? '0 available' : `${product.stock} ${t('inStock')}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              aria-label={t('addToCart')}
              className={`group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 active:scale-90 ${
                isOutOfStock
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                  : isAdding
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                    : 'bg-gray-900 text-white shadow-lg hover:bg-green-600 hover:shadow-green-500/30 dark:bg-white dark:text-gray-900 dark:hover:bg-green-500'
              }`}
            >
              {isAdding ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
