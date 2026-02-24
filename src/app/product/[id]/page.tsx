'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setIsLoading(false)
      })
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      alert('Added to cart!')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/products" className="text-green-600 hover:underline">Back to products</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-green-600 hover:underline mb-6">
        <ArrowLeft size={20} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.organic && (
            <span className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
              🌿 Organic
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <span className="text-green-600 font-medium">{product.category}</span>
            <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b py-6">
            <div className="text-4xl font-bold text-green-600 mb-2">{formatPrice(product.price)}</div>
            <p className="text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition"
                  disabled={quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="px-6 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-100 transition"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={24} />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Truck className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same-day delivery available</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <Shield className="text-purple-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-1">Quality Assured</h3>
                <p className="text-sm text-gray-600">100% organic certified</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
