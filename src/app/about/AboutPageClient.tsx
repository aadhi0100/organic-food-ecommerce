'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Users, Award, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

const STATS = [
  { value: '100+', label: 'Organic Products' },
  { value: '200+', label: 'Partner Farms' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '5+', label: 'Years of Trust' },
]

const VALUES = [
  {
    icon: <Leaf size={36} />,
    title: '100% Certified Organic',
    desc: 'Every product carries NPOP & USDA organic certification. We test every batch before it reaches you.',
    color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    icon: <Users size={36} />,
    title: 'Supporting Local Farmers',
    desc: 'We partner directly with 200+ small-scale organic farmers across India, ensuring fair prices and sustainable livelihoods.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    icon: <Award size={36} />,
    title: 'Uncompromising Quality',
    desc: 'Our 7-step quality check ensures only the freshest, purest products make it to your doorstep.',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    icon: <Heart size={36} />,
    title: 'Health First',
    desc: 'No pesticides, no preservatives, no artificial additives. Just pure, wholesome food the way nature intended.',
    color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  },
]

export default function AboutPageClient() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=60"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
              Our Story
            </span>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl">{t('aboutUs')}</h1>
            <p className="mx-auto max-w-2xl text-xl text-green-100">
              We started with a simple belief: everyone deserves access to pure, honest food grown with care for people and the planet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-80 overflow-hidden rounded-3xl shadow-xl lg:h-96"
            >
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=85"
                alt="Organic farm produce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-extrabold text-gray-900 dark:text-white">{t('ourMission')}</h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {t('aboutDescription1') || 'Founded in 2019, Organi was born from a passion for clean eating and sustainable agriculture. We saw how difficult it was for urban families to access genuinely organic food, and we decided to change that.'}
              </p>
              <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {t('aboutDescription2') || 'Today, we work with over 200 certified organic farms across India, bringing you the freshest seasonal produce, pantry staples, dairy, and more — all verified organic, all delivered fresh.'}
              </p>
              <Link href="/products">
                <button className="btn-primary rounded-full px-8 py-3 text-base">
                  Shop Our Products <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 rounded-2xl bg-gray-50 p-6 dark:bg-gray-700"
              >
                <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${value.color}`}>
                  {value.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-extrabold">Ready to Eat Healthier?</h2>
            <p className="mx-auto mb-8 max-w-xl text-xl text-green-100">
              Join 50,000+ families who have made the switch to certified organic food.
            </p>
            <Link href="/products">
              <button className="rounded-full bg-white px-10 py-4 text-base font-bold text-green-700 shadow-xl transition hover:bg-green-50">
                Start Shopping <ArrowRight size={18} className="ml-1 inline" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
