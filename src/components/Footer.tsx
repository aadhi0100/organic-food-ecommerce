'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { SubscribeForm } from './SubscribeForm'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <SubscribeForm />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              {t('organicFood')}
            </h3>
            <p className="text-sm mb-4">{t('farmFresh')}</p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-green-400 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-green-400 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-green-400 transition"><Instagram size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-green-400 transition">{t('products')}</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition">{t('about')}</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition">{t('contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{t('category')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Fruits" className="hover:text-green-400 transition">{t('fruits')}</Link></li>
              <li><Link href="/products?category=Vegetables" className="hover:text-green-400 transition">{t('vegetables')}</Link></li>
              <li><Link href="/products?category=Dairy" className="hover:text-green-400 transition">{t('dairy')}</Link></li>
              <li><Link href="/products?category=Bakery" className="hover:text-green-400 transition">{t('bakery')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{t('contact')}</h4>
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
          <p>&copy; {new Date().getFullYear()} {t('organicFood')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  )
}
