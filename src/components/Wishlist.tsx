'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNotification } from '@/context/NotificationContext'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { notify } = useNotification()
  const { t } = useLanguage()

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  const addToWishlist = (productId: string) => {
    const updated = [...wishlist, productId]
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    notify('success', t('addedToWishlist'))
  }

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(id => id !== productId)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    notify('info', t('removedFromWishlist'))
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist }
}

export function WishlistButton({ productId }: { productId: string }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(productId)
  const { t } = useLanguage()

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
      aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
      className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700"
    >
      <Heart
        size={20}
        className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
    </motion.button>
  )
}
