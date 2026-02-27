'use client'

import { Share2, Facebook, Twitter, Copy } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotification } from '@/context/NotificationContext'

interface SocialShareProps {
  url: string
  title: string
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { notify } = useNotification()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    notify('success', 'Link copied!')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <Share2 size={20} />
        <span className="dark:text-white">Share</span>
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 z-50 min-w-[200px]"
          >
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Copy size={20} />
              <span className="dark:text-white">Copy Link</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
