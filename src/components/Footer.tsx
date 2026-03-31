'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { SubscribeForm } from './SubscribeForm'
import { useLanguage } from '@/context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <SubscribeForm />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-2xl" aria-hidden="true">
                🌿
              </span>
              {t('organicFood')}
            </h3>
            <p className="mb-4 text-sm">{t('farmFresh')}</p>
            <div className="flex gap-3">
              <a href="#" className="transition hover:text-green-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="transition hover:text-green-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="transition hover:text-green-400">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="transition hover:text-green-400">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-green-400">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-green-400">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">{t('category')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=Fruits" className="transition hover:text-green-400">
                  {t('fruits')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Vegetables" className="transition hover:text-green-400">
                  {t('vegetables')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dairy" className="transition hover:text-green-400">
                  {t('dairy')}
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bakery" className="transition hover:text-green-400">
                  {t('bakery')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">{t('contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>{t('phone')}: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>{t('email')}: info@organicfood.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>
                  No. 12, Anna Salai, Teynampet
                  <br />
                  Chennai, Tamil Nadu 600018
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {t('organicFood')}. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
