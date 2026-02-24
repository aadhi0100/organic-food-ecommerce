'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { SubscribeForm } from './SubscribeForm'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <SubscribeForm />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              Organic Food
            </h3>
            <p className="text-sm mb-4">Fresh organic food delivered to your door. Quality you can trust.</p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-green-400 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-green-400 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-green-400 transition"><Instagram size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-green-400 transition">Products</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-green-400 transition">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Fruits" className="hover:text-green-400 transition">Fruits</Link></li>
              <li><Link href="/products?category=Vegetables" className="hover:text-green-400 transition">Vegetables</Link></li>
              <li><Link href="/products?category=Dairy" className="hover:text-green-400 transition">Dairy</Link></li>
              <li><Link href="/products?category=Bakery" className="hover:text-green-400 transition">Bakery</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@organicfood.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>123 Organic Street<br />Green City, GC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Organic Food Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
