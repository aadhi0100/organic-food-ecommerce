'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null | undefined
  fallbackSrc?: string
}

const EMOJI_MAP: Record<string, string> = {
  apple: '🍎', banana: '🍌', orange: '🍊', mango: '🥭',
  strawberr: '🍓', blueberr: '🫐', grape: '🍇', pineapple: '🍍',
  papaya: '🍈', watermelon: '🍉', pomegranate: '🪀', kiwi: '🥝',
  pear: '🍐', peach: '🍑', avocado: '🥑',
  spinach: '🥬', kale: '🥬', lettuce: '🥬',
  carrot: '🥕', beetroot: '🧅', potato: '🥔', onion: '🧅',
  tomato: '🍅', cucumber: '🥒', bell: '🫑', pepper: '🫑',
  broccoli: '🥦', cauliflower: '🥦', corn: '🌽',
  ginger: '🫚', garlic: '🧄',
  rice: '🍚', quinoa: '🌾', millet: '🌾', barley: '🌾', oat: '🌾',
  flour: '🌾', semolina: '🌾', pasta: '🍝', dal: '🥣',
  milk: '🥛', cheese: '🧀', butter: '🧈', paneer: '🧀',
  spice: '🌶️', oil: '🫙',
  juice: '🧃', tea: '🍵', coffee: '☕',
  nut: '🥜', almond: '🥜', cashew: '🥜', walnut: '🥜',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  vegetables: 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)',
  fruits: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
  dairy: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
  grains: 'linear-gradient(135deg, #fef9c3 0%, #facc15 100%)',
  pulses: 'linear-gradient(135deg, #ffedd5 0%, #fb923c 100%)',
  spices: 'linear-gradient(135deg, #fee2e2 0%, #f87171 100%)',
  oils: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
  beverages: 'linear-gradient(135deg, #cffafe 0%, #22d3ee 100%)',
  nuts: 'linear-gradient(135deg, #ffedd5 0%, #f97316 100%)',
  default: 'linear-gradient(135deg, #f3f4f6 0%, #9ca3af 100%)',
}

function ProductPlaceholder({ alt, className }: { alt: string; className?: string }) {
  const word = (alt || '').toLowerCase()
  
  // Find matching emoji
  let emoji = '🌿'
  for (const [key, val] of Object.entries(EMOJI_MAP)) {
    if (word.includes(key)) {
      emoji = val
      break
    }
  }

  // Find matching gradient category
  let gradient = CATEGORY_GRADIENTS.default!
  for (const key of Object.keys(CATEGORY_GRADIENTS)) {
    if (word.includes(key)) {
      gradient = CATEGORY_GRADIENTS[key]!
      break
    }
  }

  return (
    <div
      aria-label={alt}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradient,
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Decorative background shapes */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(20px)' }} />
      
      {/* Central emoji container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '60%',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        fontSize: '4rem',
        userSelect: 'none',
        transition: 'transform 0.3s ease',
      }}>
        <span style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }}>
          {emoji}
        </span>
      </div>
    </div>
  )
}

export function SafeImage({ src, fallbackSrc, alt, onError, className, ...props }: SafeImageProps) {
  const initialSrc = useMemo(() => (src || '').trim() || null, [src])
  const [currentSrc, setCurrentSrc] = useState<string | null>(initialSrc)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrentSrc(initialSrc)
    setFailed(false)
  }, [initialSrc])

  if (failed || !currentSrc) {
    return <ProductPlaceholder alt={alt as string} className={className} />
  }

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      className={className}
      onError={(e) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        } else {
          setFailed(true)
        }
        onError?.(e)
      }}
    />
  )
}
