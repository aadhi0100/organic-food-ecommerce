'use client'

import { useEffect, useState } from 'react'
import { getActiveFestivalOffer, type FestivalOffer } from '@/lib/festivalOffers'
import { Sparkles, X } from 'lucide-react'

export function FestivalOfferBanner() {
  const [offer, setOffer] = useState<FestivalOffer | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const activeOffer = getActiveFestivalOffer()
    setOffer(activeOffer)
  }, [])

  if (!offer || !visible) return null

  return (
    <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-3 px-4 relative animate-pulse">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="animate-spin" size={24} />
          <div>
            <p className="font-bold text-lg">{offer.name} - {offer.nameHindi}</p>
            <p className="text-sm">Get {offer.discount}% OFF on all products! Limited time offer!</p>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="hover:bg-white/20 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
