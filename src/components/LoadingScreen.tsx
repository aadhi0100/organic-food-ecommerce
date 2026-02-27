'use client'

import { motion } from 'framer-motion'

const loadingMessages = [
  { emoji: '🛒', text: 'Loading fresh products...' },
  { emoji: '🥬', text: 'Picking organic vegetables...' },
  { emoji: '🍎', text: 'Selecting fresh fruits...' },
  { emoji: '🥛', text: 'Getting dairy products...' },
  { emoji: '🌾', text: 'Gathering grains...' },
]

export function LoadingScreen() {
  const index = Math.floor(Math.random() * loadingMessages.length)
  const randomMessage = loadingMessages[index]!

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-6"
        >
          {randomMessage.emoji}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4"
        >
          {randomMessage.text}
        </motion.h2>
        
        <div className="flex gap-2 justify-center">
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
              className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"
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
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
      />
    </div>
  )
}
