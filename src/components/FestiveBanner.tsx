'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function FestiveBanner() {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 relative overflow-hidden"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-3xl"
          >
            🪔
          </motion.span>
          <div>
            <p className="font-bold text-lg">
              Diwali Special! Get 25% OFF
            </p>
            <p className="text-sm opacity-90">On all organic products. Limited time offer!</p>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="p-2 hover:bg-white/20 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>
    </motion.div>
  )
}
