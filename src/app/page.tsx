'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Leaf, Award, Truck, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    { icon: <Leaf size={40} />, title: '100% Organic', desc: 'Certified organic products', color: 'green' },
    { icon: <Truck size={40} />, title: 'Fast Delivery', desc: 'Same day delivery available', color: 'blue' },
    { icon: <Award size={40} />, title: 'Best Quality', desc: 'Premium quality guaranteed', color: 'purple' },
    { icon: <ShoppingBag size={40} />, title: 'Easy Shopping', desc: 'Simple and secure checkout', color: 'orange' }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920"
            alt="Organic Food"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="mb-6 animate-fade-in">
            <span className="text-7xl">🌿</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
            Fresh Organic Food
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up-delay">
            Farm-fresh organic products delivered to your doorstep
          </p>
          <div className="flex gap-4 justify-center animate-slide-up-delay-2">
            <Link href="/products">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-2xl flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-2xl">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer border-2 ${
                  hoveredCard === idx 
                    ? 'shadow-2xl scale-110 border-green-500 -translate-y-2' 
                    : 'shadow-lg border-gray-100'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
                  hoveredCard === idx ? 'bg-green-100 scale-110' : 'bg-gray-100'
                }`}>
                  <div className={`${hoveredCard === idx ? 'text-green-600' : 'text-gray-600'}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800"
                alt="Fresh Produce"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-5xl font-bold mb-6">Farm Fresh Organic Products</h2>
              <p className="text-xl text-gray-700 mb-8">
                We source directly from certified organic farms across India, ensuring the highest quality and freshness for your family.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>100% Certified Organic</span>
                </li>
                <li className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>No Pesticides or Chemicals</span>
                </li>
                <li className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>Direct from Farmers</span>
                </li>
              </ul>
              <Link href="/products">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105">
                  Explore Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  )
}
