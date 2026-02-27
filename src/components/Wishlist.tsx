'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNotification } from '@/context/NotificationContext'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { notify } = useNotification()

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  const addToWishlist = (productId: string) => {
    const updated = [...wishlist, productId]
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    notify('success', 'Added to wishlist!')
  }

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(id => id !== productId)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    notify('info', 'Removed from wishlist')
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist }
}

export function WishlistButton({ productId }: { productId: string }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    inWishlist ? removeFromWishlist(productId) : addToWishlist(productId)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Heart
        size={24}
        className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
    </motion.button>
  )
}
