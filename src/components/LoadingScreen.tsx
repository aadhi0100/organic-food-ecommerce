'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

const loadingKeys = [
  'loadingFreshProducts',
  'loadingVegetables',
  'loadingFruits',
  'loadingDairy',
  'loadingGrains',
]

export function LoadingScreen() {
  const { t } = useLanguage()
  const key = loadingKeys[Math.floor(Math.random() * loadingKeys.length)]!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          {/* Glow ring */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl bg-green-400 blur-xl dark:bg-green-600"
          />
          <Image
            src="/icon-512.svg"
            alt="OrganicFood"
            width={96}
            height={96}
            className="relative rounded-2xl shadow-2xl"
          />
        </motion.div>

        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-green-700 dark:text-green-400 tracking-tight"
          >
            Organi<span className="text-emerald-500">Food</span>
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {t(key)}
          </motion.h2>
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function MiniLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-green-200 border-t-green-600"
      />
    </div>
  )
}
