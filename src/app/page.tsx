'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Leaf, Award, Truck, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { t } = useLanguage()

  const features = [
    { icon: <Leaf size={40} />, title: t('certified'), desc: t('qualityProducts'), color: 'green' },
    { icon: <Truck size={40} />, title: t('fastDelivery'), desc: t('farmFresh'), color: 'blue' },
    { icon: <Award size={40} />, title: t('bestQuality'), desc: t('healthFirst'), color: 'purple' },
    { icon: <ShoppingBag size={40} />, title: t('easyShopping'), desc: t('shopOrganic'), color: 'orange' }
  ]

  return (
    <div className="min-h-screen dark:bg-gray-900">
      
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920"
            alt={t('organicFood')}
            fill
            className="object-cover brightness-50 dark:brightness-40"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="text-7xl">🌿</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            {t('freshOrganic')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            {t('farmFresh')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-2xl flex items-center gap-2">
                {t('shopNow')} <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-2xl">
                {t('login')}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 dark:text-white"
          >
            {t('whyChooseUs')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white dark:bg-gray-700 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer border-2 ${
                  hoveredCard === idx 
                    ? 'shadow-2xl border-green-500' 
                    : 'shadow-lg border-gray-100 dark:border-gray-600'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
                  hoveredCard === idx ? 'bg-green-100 dark:bg-green-900 scale-110' : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <div className={`${hoveredCard === idx ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800"
                alt={t('freshOrganic')}
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 dark:text-white">{t('freshOrganic')}</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                {t('farmFresh')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-lg dark:text-gray-200">
                  <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                  <span>{t('certified')}</span>
                </li>
                <li className="flex items-center gap-3 text-lg dark:text-gray-200">
                  <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                  <span>{t('bestQuality')}</span>
                </li>
                <li className="flex items-center gap-3 text-lg dark:text-gray-200">
                  <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                  <span>{t('fastDelivery')}</span>
                </li>
              </ul>
              <Link href="/products">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105">
                  {t('products')}
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
