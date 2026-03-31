'use client'

import React from 'react';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getColor(hash: number, offset: number): string {
  const hue = (hash + offset * 137.5) % 360;
  // Keep saturation high to look vibrant, lightness moderately bright
  const saturation = 70 + (hash % 25);
  const lightness = 45 + ((hash >> 2) % 15); 
  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
}

interface ProductVisualProps {
  product: { id: string | number; name: string };
  className?: string;
}

export function ProductVisual({ product, className = '' }: ProductVisualProps) {
  const seedStr = `${product.id}-${product.name}`;
  const hash = hashString(seedStr);
  
  // Generate a unique palette of 4 colors
  const c1 = getColor(hash, 1);
  const c2 = getColor(hash, 2);
  const c3 = getColor(hash, 3);
  const c4 = getColor(hash, 4);

  // Randomize some positions deterministically
  const cx1 = 20 + (hash % 60);
  const cy1 = 20 + ((hash >> 2) % 60);
  const r1 = 15 + ((hash >> 3) % 30);

  const cx2 = 40 + ((hash >> 4) % 60);
  const cy2 = 40 + ((hash >> 5) % 60);
  const r2 = 25 + ((hash >> 6) % 35);

  const cx3 = 60 + ((hash >> 7) % 40);
  const cy3 = 10 + ((hash >> 8) % 80);
  const r3 = 20 + ((hash >> 9) % 20);

  // Geometric abstract path (e.g., triangle/polygon)
  const p1x = hash % 100;
  const p1y = 0;
  const p2x = 100;
  const p2y = (hash >> 1) % 100;
  const p3x = (hash >> 2) % 100;
  const p3y = 100;

  // The huge initial letter
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad1-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
          <linearGradient id={`grad2-${product.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c3} />
            <stop offset="100%" stopColor={c4} />
          </linearGradient>
          <filter id={`blur-${product.id}`}>
            <feGaussianBlur stdDeviation="15" />
          </filter>
        </defs>
        
        {/* Base background rect */}
        <rect width="100%" height="100%" fill={`url(#grad1-${product.id})`} />
        
        {/* Soft floating orbs */}
        <circle cx={`${cx1}%`} cy={`${cy1}%`} r={`${r1}%`} fill={c3} filter={`url(#blur-${product.id})`} opacity="0.8" />
        <circle cx={`${cx2}%`} cy={`${cy2}%`} r={`${r2}%`} fill={c4} filter={`url(#blur-${product.id})`} opacity="0.6" />
        <circle cx={`${cx3}%`} cy={`${cy3}%`} r={`${r3}%`} fill={`url(#grad2-${product.id})`} filter={`url(#blur-${product.id})`} opacity="0.9" />
        
        {/* Sharp abstract diagonal cut for modern dynamic vibe */}
        <polygon points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`} fill="#ffffff" opacity="0.07" />
        
        {/* Noise overlay to give it a premium physical texture feel */}
        <rect width="100%" height="100%" fill="url(#noise)" opacity="0.3" style={{ mixBlendMode: 'overlay' }} />
        <defs>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
        </defs>
      </svg>
      
      {/* Massive typography abstract background */}
      <div 
        className="absolute -bottom-8 -right-4 select-none font-black leading-none text-white mix-blend-overlay transition-transform duration-700 hover:scale-110"
        style={{ fontSize: '12rem', opacity: 0.2 }}
      >
        {initial}
      </div>
      
      {/* Secondary abstract letters randomly placed */}
      <div 
        className="absolute top-4 left-6 select-none font-bold italic text-white mix-blend-overlay"
        style={{ fontSize: '3rem', opacity: 0.15, transform: `rotate(${(hash % 45)}deg)` }}
      >
        {product.name.split(' ')[1]?.[0]?.toUpperCase() || ''}
      </div>
    </div>
  );
}
