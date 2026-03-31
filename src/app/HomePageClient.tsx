'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Leaf, Award, Truck, ArrowRight, ChevronRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { OrganiLogo } from '@/components/OrganiLogo'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/SkeletonLoader'
import type { Product } from '@/types'

const CATEGORIES = [
  { name: 'Fruits', icon: '🍎', color: 'from-red-400 to-orange-400', href: '/products?category=Fruits' },
  { name: 'Vegetables', icon: '🥦', color: 'from-green-400 to-emerald-500', href: '/products?category=Vegetables' },
  { name: 'Dairy', icon: '🥛', color: 'from-blue-300 to-blue-500', href: '/products?category=Dairy' },
  { name: 'Grains', icon: '🌾', color: 'from-yellow-400 to-amber-500', href: '/products?category=Grains' },
  { name: 'Spices', icon: '🌶️', color: 'from-red-500 to-rose-600', href: '/products?category=Spices' },
  { name: 'Nuts', icon: '🥜', color: 'from-amber-500 to-yellow-600', href: '/products?category=Nuts' },
  { name: 'Beverages', icon: '🍵', color: 'from-teal-400 to-cyan-500', href: '/products?category=Beverages' },
  { name: 'Snacks', icon: '🍫', color: 'from-purple-400 to-violet-500', href: '/products?category=Snacks' },
]

const FEATURES = [
  {
    icon: <Leaf size={28} />,
    title: '100% Certified Organic',
    desc: 'Every product is certified by NPOP & USDA organic standards',
    color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    icon: <Truck size={28} />,
    title: 'Same-Day Delivery',
    desc: 'Order before 12 PM for same-day delivery across major cities',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    icon: <Award size={28} />,
    title: 'Premium Quality',
    desc: 'Handpicked from trusted farms with strict quality checks',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    icon: <ShoppingBag size={28} />,
    title: 'Easy Returns',
    desc: 'Not satisfied? Get a full refund within 24 hours, no questions asked',
    color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'Best organic store I\'ve found! The vegetables are incredibly fresh and the delivery is always on time.' },
  { name: 'Rajesh Kumar', city: 'Bangalore', rating: 5, text: 'The quality is unmatched. My family has switched completely to Organi for all our grocery needs.' },
  { name: 'Anita Patel', city: 'Chennai', rating: 5, text: 'Love the variety of organic products. The spices especially are so aromatic and pure!' },
]

export default function HomePageClient() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setFeaturedProducts(Array.isArray(data) ? data.slice(0, 8) : [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=85"
            alt="Fresh organic produce"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <OrganiLogo variant="light" size="lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            India&apos;s #1 Organic Food Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mb-5 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
          >
            Farm Fresh.{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Certified Organic.
            </span>
            <br />
            Delivered Daily.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl"
          >
            Over 100+ certified organic products sourced directly from trusted Indian farms.
            No pesticides. No preservatives. Just pure goodness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/products">
              <button className="touch-target flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-green-500/30 transition-all duration-200 hover:scale-105 hover:bg-green-400 active:scale-95">
                Shop Now <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/about">
              <button className="touch-target rounded-full border-2 border-white/60 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95">
                Our Story
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-14 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: '100+', label: 'Organic Products' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '24hr', label: 'Fast Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-green-400">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of certified organic products</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={cat.href}>
                  <div className="group flex flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-3xl shadow-md transition-transform duration-200 group-hover:scale-110`}>
                      {cat.icon}
                    </div>
                    <span className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-700"
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${feature.color}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <h2 className="section-title">{t('featuredProducts')}</h2>
              <p className="section-subtitle">Handpicked bestsellers from our organic collection</p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-600 hover:text-white sm:flex"
            >
              {t('viewAll')} <ChevronRight size={16} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link href="/products">
              <button className="btn-primary rounded-full px-10 py-4 text-base">
                Browse All Products <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── About Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 py-20">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=60"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
                Our Story
              </span>
              <h2 className="mb-6 text-4xl font-extrabold leading-tight">
                From Farm to Your Table — Pure &amp; Honest
              </h2>
              <p className="mb-6 text-lg text-green-100">
                We partner directly with certified organic farmers across India to bring you the freshest produce
                without any middlemen. Every product is tested for purity before it reaches your doorstep.
              </p>
              <ul className="mb-8 space-y-3">
                {['NPOP & USDA Certified Organic', 'Direct from 200+ Indian Farms', 'Zero Pesticides & Preservatives', 'Cold-chain delivery for freshness'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-green-100">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <button className="rounded-full bg-white px-8 py-3 font-bold text-green-700 transition hover:bg-green-50">
                  Learn More
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-80 overflow-hidden rounded-3xl shadow-2xl lg:h-96"
            >
              <Image
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=85"
                alt="Fresh organic farm produce"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Trusted by 50,000+ happy families across India</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-700"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
