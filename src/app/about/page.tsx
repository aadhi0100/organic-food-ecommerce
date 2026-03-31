import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us | Organi — India\'s Premium Organic Food Store',
  description: 'Learn about our mission to bring 100% certified organic food from trusted Indian farms directly to your table.',
}

export default function AboutPage() {
  return <AboutPageClient />
}
