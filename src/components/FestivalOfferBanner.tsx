'use client'

import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { getActiveFestivalOffer, type FestivalOffer } from '@/lib/festivalOffers'
import { useLanguage } from '@/context/LanguageContext'

export function FestivalOfferBanner() {
  const { t } = useLanguage()
  const [offer, setOffer] = useState<FestivalOffer | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setOffer(getActiveFestivalOffer())
  }, [])

  if (!offer || !visible) return null

  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-4 py-3 text-white">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles size={24} />
          <div>
            <p className="text-lg font-bold">
              {offer.name} - {offer.nameHindi}
            </p>
            <p className="text-sm">{t('festivalOfferText', { discount: offer.discount })}</p>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="rounded-full p-2 transition hover:bg-white/20">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
