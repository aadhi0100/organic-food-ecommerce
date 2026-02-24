import type { Product } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  return res.json()
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  return res.json()
}
