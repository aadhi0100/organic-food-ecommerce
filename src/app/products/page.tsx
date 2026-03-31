import type { Metadata } from 'next'
import ProductsPageClient from './ProductsPageClient'

export const metadata: Metadata = {
  title: 'Organic Products | Shop Fresh Organic Food Online',
  description: 'Browse 100+ certified organic products — fruits, vegetables, dairy, grains, spices and more. Fresh, pure, and delivered to your door.',
}

export default function ProductsPage() {
  return <ProductsPageClient />
}
