'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Shield, ShoppingCart, Star, Truck, Package, Share2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/context/LanguageContext'
import { useNotification } from '@/context/NotificationContext'
import { formatIndianCurrency } from '@/utils/indianFormat'
import type { Product } from '@/types'
import { SafeImage } from '@/components/SafeImage'
import { WishlistButton } from '@/components/Wishlist'
import { SocialShare } from '@/components/SocialShare'

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="h-[480px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-12 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-14 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const { addItem } = useCart()
  const { t } = useLanguage()
  const { notify } = useNotification()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data?.id ? data : null)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!product || isAdding) return
    setIsAdding(true)
    try {
      const success = await addItem(product, quantity)
      if (success) {
        notify('success', t('addedToCartMessage', { name: product.name }))
      } else {
        notify('error', t('addToCartFailed', { name: product.name }))
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <ArrowLeft size={18} />
          {t('backToProducts')}
        </Link>

        {isLoading ? (
          <ProductSkeleton />
        ) : !product ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={64} className="mb-4 text-gray-300" />
            <h1 className="mb-4 text-2xl font-bold text-gray-700 dark:text-gray-300">{t('productNotFound')}</h1>
            <Link href="/products" className="btn-primary rounded-full px-6 py-2.5 text-sm">
              {t('backToProducts')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative h-[480px] overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.organic && (
                  <span className="absolute right-4 top-4 rounded-full bg-green-500 px-4 py-1.5 text-sm font-bold text-white shadow">
                    🌿 {t('organic')}
                  </span>
                )}
                <div className="absolute left-4 top-4">
                  <WishlistButton productId={product.id} />
                </div>
              </div>

              {/* Thumbnail strip if multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      <SafeImage src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="badge-green">{product.category}</span>
                  {product.featured && <span className="badge-yellow">⭐ Featured</span>}
                </div>
                <h1 className="mb-3 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl">
                  {product.name}
                </h1>

                <div className="mb-4 flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.reviews} {t('reviews')})</span>
                </div>

                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{product.description}</p>
              </div>

              {/* Price & Stock */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 text-4xl font-extrabold text-green-600 dark:text-green-400">
                  {formatIndianCurrency(product.price)}
                </div>
                <p className="text-sm">
                  {product.stock > 0 ? (
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ✓ In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="font-semibold text-red-500">{t('outOfStock')}</span>
                  )}
                </p>
              </div>

              {/* Quantity + Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{t('quantity')}:</span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-700"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-700"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAdding}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-md transition hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-600"
                  >
                    {isAdding ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <ShoppingCart size={20} />
                    )}
                    {isAdding ? t('adding') : t('addToCart')}
                  </button>

                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    aria-label="Share product"
                  >
                    <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {showShare && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <SocialShare
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                      title={product.name}
                      description={product.description}
                    />
                  </motion.div>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <Truck className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t('fastDelivery')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Same-day available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                  <Shield className="mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t('qualityAssured')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">NPOP Certified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
