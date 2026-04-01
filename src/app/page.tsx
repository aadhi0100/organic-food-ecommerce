import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Organic — Fresh Organic Food Delivered | India\'s Premium Organic Store',
  description: 'Shop 100% certified organic fruits, vegetables, dairy, grains, spices and more. Farm-fresh organic food delivered to your door across India.',
  keywords: ['organic food India', 'fresh organic vegetables', 'organic fruits delivery', 'certified organic', 'healthy food online'],
  openGraph: {
    title: 'Organic — Fresh Organic Food Delivered',
    description: 'India\'s premium organic food marketplace. 100% certified, farm-fresh, delivered to your door.',
    images: [{ url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return <HomePageClient />
}
