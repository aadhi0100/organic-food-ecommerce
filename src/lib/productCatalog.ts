import type { Product } from '@/types'
import { allProducts } from '@/lib/allProducts'
import { PRODUCT_IMAGE_PATHS } from '@/lib/productImages.generated'
function safeSlug(input: string) {
  return (input || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const DEFAULT_IMAGE = '/images/products/organic-apples.jpg'
const REMOTE_IMAGE_HOSTS = new Set([
  'images.unsplash.com',
  'source.unsplash.com',
  'lh3.googleusercontent.com',
  'firebasestorage.googleapis.com',
  'encrypted-tbn0.gstatic.com',
  'upload.wikimedia.org',
])

const LOCAL_IMAGE_SET: Set<string> = new Set(PRODUCT_IMAGE_PATHS)

function basenameNoExt(filePath: string) {
  const base = filePath.split('/').pop() || filePath
  return base.replace(/\.[a-z0-9]+$/i, '')
}

function scoreImageMatch(productSlug: string, imageBase: string) {
  if (imageBase === productSlug) return 100
  if (imageBase.startsWith(`${productSlug}-`)) return 90
  if (imageBase.startsWith(productSlug)) return 80
  if (imageBase.includes(productSlug)) return 70

  const stripped = productSlug.replace(/^(organic|fresh)-/, '')
  if (stripped && imageBase === stripped) return 60
  if (stripped && imageBase.startsWith(`${stripped}-`)) return 55
  if (stripped && imageBase.includes(stripped)) return 50

  return 0
}

function pickImagesForProductName(name: string) {
  const productSlug = safeSlug(name)
  const scored = PRODUCT_IMAGE_PATHS.map((imagePath) => {
    const base = basenameNoExt(imagePath)
    return { imagePath, base, score: scoreImageMatch(productSlug, base) }
  }).filter((entry) => entry.score > 0)

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.base.length !== b.base.length) return a.base.length - b.base.length
    return a.imagePath.localeCompare(b.imagePath)
  })

  return scored.slice(0, 4).map((entry) => entry.imagePath)
}

function hasLocalImage(imagePath: string) {
  const cleanPath = imagePath.trim()
  if (!cleanPath.startsWith('/')) return false
  return LOCAL_IMAGE_SET.has(cleanPath)
}

function hasAllowedRemoteImage(imagePath: string) {
  try {
    const url = new URL(imagePath)
    return url.protocol === 'https:' && REMOTE_IMAGE_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

export function isValidImageSource(imagePath?: string | null) {
  const candidate = String(imagePath || '').trim()
  if (!candidate) return false
  if (candidate.startsWith('data:image/')) return true
  if (candidate.startsWith('/')) return hasLocalImage(candidate)
  if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
    return hasAllowedRemoteImage(candidate)
  }
  return false
}

export function normalizeProductImages(product: Pick<Product, 'name' | 'image' | 'images'>): {
  image: string
  images: string[]
} {
  // Explicit local image always wins — only fall back to fuzzy match if it's missing/invalid
  const explicitValid = product.image && isValidImageSource(product.image) ? product.image : null

  const candidates = [
    ...(explicitValid ? [explicitValid] : []),
    ...(product.images || []).filter((img) => img && !img.includes('picsum.photos')),
    ...pickImagesForProductName(String(product.name || '')),
    DEFAULT_IMAGE,
  ]

  const images = Array.from(
    new Set(
      candidates
        .map((candidate) => String(candidate || '').trim())
        .filter((candidate) => isValidImageSource(candidate)),
    ),
  )

  const image = images[0] || DEFAULT_IMAGE
  return {
    image,
    images: images.length > 0 ? images : [image],
  }
}

export function normalizeProductRecord(product: Product): Product {
  const normalizedImages = normalizeProductImages(product)
  return {
    ...product,
    image: normalizedImages.image,
    images: normalizedImages.images,
  }
}

export function buildSeedProducts(): Product[] {
  return (allProducts as Product[]).map((product) => {
    // Always prefer the explicit local image path from allProducts first
    const explicitImage = product.image && hasLocalImage(product.image) ? product.image : null
    const fallbackImages = pickImagesForProductName(String(product.name || ''))
    const primaryImage = explicitImage || fallbackImages[0] || DEFAULT_IMAGE
    return normalizeProductRecord({
      ...product,
      image: primaryImage,
      images: [primaryImage, ...fallbackImages.filter((p) => p !== primaryImage)],
    })
  })
}

export const seedProducts = buildSeedProducts()

export const WAREHOUSE_INFO = {
  name: 'Tamil Nadu Central Warehouse',
  address: 'SIDCO Industrial Estate, Ambattur, Chennai, Tamil Nadu, India',
  city: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
}
