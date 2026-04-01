'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
}

const sizeMap = {
  sm: { icon: 28, text: 'text-base', sub: 'text-[10px]', gap: 'gap-1.5' },
  md: { icon: 38, text: 'text-xl', sub: 'text-[11px]', gap: 'gap-2' },
  lg: { icon: 56, text: 'text-3xl', sub: 'text-sm', gap: 'gap-3' },
}

function LeafIcon({ size, variant }: { size: number; variant: 'light' | 'dark' }) {
  const id = `logo-${size}-${variant}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === 'light' ? '#ffffff' : '#15803d'} stopOpacity={variant === 'light' ? '0.25' : '1'} />
          <stop offset="100%" stopColor={variant === 'light' ? '#ffffff' : '#065f46'} stopOpacity={variant === 'light' ? '0.1' : '1'} />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={variant === 'light' ? '#ffffff' : '#bbf7d0'} />
          <stop offset="55%" stopColor={variant === 'light' ? '#d1fae5' : '#4ade80'} />
          <stop offset="100%" stopColor={variant === 'light' ? '#a7f3d0' : '#16a34a'} />
        </linearGradient>
        <radialGradient id={`${id}-dew`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#052e16" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded bg pill for dark variant */}
      {variant === 'dark' && (
        <rect width="40" height="40" rx="10" fill={`url(#${id}-bg)`} />
      )}

      {/* Leaf */}
      <g filter={`url(#${id}-shadow)`}>
        <path
          d="M20 5.5 C15.5 5.5 11 8.5 9.5 13 C8 17.5 9 22.5 12 26 C14.5 28.8 17.5 30.3 20 30.8 L20 33.5 L20.5 33.5 L20.5 30.8 C23 30.3 26 28.8 28.5 26 C31.5 22.5 32.5 17.5 31 13 C29.5 8.5 24.5 5.5 20 5.5 Z"
          fill={`url(#${id}-leaf)`}
        />
      </g>

      {/* Central vein */}
      <path d="M20 9 L20 31" stroke={variant === 'light' ? 'rgba(255,255,255,0.4)' : '#15803d'} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />

      {/* Side veins left */}
      <path d="M20 15 Q16.5 13.5 14 14.5" stroke={variant === 'light' ? 'rgba(255,255,255,0.35)' : '#15803d'} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M20 19.5 Q15.5 18 13 19" stroke={variant === 'light' ? 'rgba(255,255,255,0.3)' : '#15803d'} strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.45" />
      <path d="M20 24 Q16.5 22.5 14.5 23.5" stroke={variant === 'light' ? 'rgba(255,255,255,0.25)' : '#15803d'} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Side veins right */}
      <path d="M20 15 Q23.5 13.5 26 14.5" stroke={variant === 'light' ? 'rgba(255,255,255,0.35)' : '#15803d'} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M20 19.5 Q24.5 18 27 19" stroke={variant === 'light' ? 'rgba(255,255,255,0.3)' : '#15803d'} strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.45" />
      <path d="M20 24 Q23.5 22.5 25.5 23.5" stroke={variant === 'light' ? 'rgba(255,255,255,0.25)' : '#15803d'} strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Highlight sheen */}
      <path
        d="M20 7 C17.5 8 14.5 10.5 13 14 C11.8 17 12.2 20.5 13.5 23 C15.5 19.5 17.5 14.5 20 12 C22.5 14.5 24.5 19.5 26.5 23 C27.8 20.5 28.2 17 27 14 C25.5 10.5 22.5 8 20 7 Z"
        fill="white"
        opacity="0.15"
      />

      {/* Stem */}
      <rect x="19.2" y="33.5" width="1.6" height="3.5" rx="0.8" fill={variant === 'light' ? 'rgba(255,255,255,0.7)' : '#4ade80'} />

      {/* Dewdrop */}
      <ellipse cx="15.5" cy="16.5" rx="1.4" ry="1.8" fill={`url(#${id}-dew)`} opacity="0.9" transform="rotate(-15 15.5 16.5)" />
      <ellipse cx="16" cy="16" rx="0.5" ry="0.65" fill="white" opacity="0.8" transform="rotate(-15 16 16)" />
    </svg>
  )
}

export function OrganiLogo({ href = '/', className = '', size = 'md', variant = 'dark' }: LogoProps) {
  const { t } = useLanguage()
  const s = sizeMap[size]
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'
  const subColor = variant === 'light' ? 'text-green-100' : 'text-green-600 dark:text-green-400'

  const logoContent = (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <LeafIcon size={s.icon} variant={variant} />
      <div className="flex flex-col leading-none">
        <span className={`font-bold ${s.text} ${textColor} tracking-tight`}>
          Organic<span className={variant === 'light' ? 'text-green-200' : 'text-green-600 dark:text-green-400'}>Food</span>
        </span>
        <span className={`font-medium ${s.sub} ${subColor} opacity-80 mt-0.5`}>
          Fresh &amp; Pure
        </span>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="transition-opacity hover:opacity-90">{logoContent}</Link>
  }
  return logoContent
}

export function LogoBrand({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <OrganiLogo size={size} variant="dark" />
      <div className="text-center">
        <p className="font-semibold text-gray-900 dark:text-white">Organic Food</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Fresh &amp; Pure from Farm-to-Table</p>
      </div>
    </div>
  )
}

export function LogoMark({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const px = { sm: 24, md: 32, lg: 48 }
  return <LeafIcon size={px[size]} variant="dark" />
}
