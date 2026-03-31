import fs from 'fs'
import path from 'path'
import type { Product } from '@/types'
import { normalizeProductRecord, seedProducts } from '@/lib/productCatalog'
import { dataPath, ensureDir, readJsonFile, safeSlug, writeJsonFile } from '@/lib/storage'

type StoredProduct = Product & {
  createdAt?: string
  updatedAt?: string
  warehouseLocation?: string
}

const PRODUCTS_ROOT = dataPath('products')
const PRODUCTS_BY_ID = dataPath('products', 'by-id')
const PRODUCTS_BY_CATEGORY = dataPath('products', 'by-category')
const PRODUCTS_BY_NAME = dataPath('products', 'by-name')
const PRODUCTS_INDEX = dataPath('products', 'index.json')
const PRODUCTS_CATALOG = dataPath('products', 'catalog.json')

function productDir(productId: string) {
  return path.join(PRODUCTS_BY_ID, productId)
}

function productFile(productId: string) {
  return path.join(productDir(productId), 'product.json')
}

function categoryFile(category: string, productId: string) {
  return path.join(PRODUCTS_BY_CATEGORY, safeSlug(category) || 'uncategorized', `${productId}.json`)
}

function nameFile(name: string) {
  return path.join(PRODUCTS_BY_NAME, `${safeSlug(name)}.json`)
}

function loadIndex() {
  return readJsonFile<string[]>(PRODUCTS_INDEX, [])
}

function saveIndex(ids: string[]) {
  writeJsonFile(PRODUCTS_INDEX, ids)
}

function getAllProducts(): StoredProduct[] {
  const catalog = readJsonFile<StoredProduct[]>(PRODUCTS_CATALOG, [])
  if (catalog.length > 0) return catalog.map((product) => normalizeProductRecord(product))

  const ids = loadIndex()
  if (ids.length > 0) {
    return ids
      .map((id) => readJsonFile<StoredProduct | null>(productFile(id), null))
      .map((product) => (product ? normalizeProductRecord(product) : null))
      .filter((product): product is StoredProduct => Boolean(product))
  }

  return []
}

function persistProduct(product: StoredProduct) {
  ensureDir(PRODUCTS_ROOT)
  ensureDir(PRODUCTS_BY_ID)
  ensureDir(PRODUCTS_BY_CATEGORY)
  ensureDir(PRODUCTS_BY_NAME)
  ensureDir(productDir(product.id))

  const now = new Date().toISOString()
  const record: StoredProduct = {
    ...normalizeProductRecord(product),
    updatedAt: now,
    createdAt: product.createdAt || now,
  }

  writeJsonFile(productFile(record.id), record)
  writeJsonFile(categoryFile(record.category, record.id), record)
  writeJsonFile(nameFile(record.name), record)

  const ids = loadIndex().filter((id) => id !== record.id)
  ids.push(record.id)
  saveIndex(ids)

  const all = getAllProducts().filter((item) => item.id !== record.id)
  all.push(record)
  writeJsonFile(PRODUCTS_CATALOG, all)

  return record
}

export const ProductStore = {
  init: () => {
    ensureDir(PRODUCTS_ROOT)
    ensureDir(PRODUCTS_BY_ID)
    ensureDir(PRODUCTS_BY_CATEGORY)
    ensureDir(PRODUCTS_BY_NAME)
    if (!fs.existsSync(PRODUCTS_INDEX)) {
      saveIndex([])
    }
    if (!fs.existsSync(PRODUCTS_CATALOG) || readJsonFile<StoredProduct[]>(PRODUCTS_CATALOG, []).length === 0) {
      ProductStore.saveAll(seedProducts)
    }
  },

  saveAll: (products: Product[]) => {
    const persisted = products.map((product) =>
      persistProduct({
        ...product,
        warehouseLocation: 'Tamil Nadu Central Warehouse',
      }),
    )
    writeJsonFile(PRODUCTS_CATALOG, persisted)
    return persisted
  },

  list: () => {
    return getAllProducts().map((product) => normalizeProductRecord(product))
  },

  findMany: async (filter?: { category?: string; search?: string; shopId?: string }) => {
    let products = getAllProducts()
    if (products.length === 0) {
      products = ProductStore.saveAll(seedProducts)
    }

    if (filter?.category) {
      products = products.filter((product) => product.category === filter.category)
    }
    if (filter?.shopId) {
      products = products.filter((product) => product.shopId === filter.shopId)
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase()
      products = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        )
      })
    }
    return products.map((product) => normalizeProductRecord(product))
  },

  findById: async (id: string) => {
    const cached = readJsonFile<StoredProduct | null>(productFile(id), null)
    if (cached) return normalizeProductRecord(cached)
    const product = getAllProducts().find((entry) => entry.id === id) || null
    return product ? normalizeProductRecord(product) : null
  },

  findFeatured: async () => {
    return getAllProducts()
      .filter((product) => product.featured)
      .map((product) => normalizeProductRecord(product))
  },

  upsert: async (product: Product) => {
    return persistProduct({
      ...product,
      warehouseLocation: 'Tamil Nadu Central Warehouse',
    })
  },

  updateStock: async (id: string, quantityDelta: number) => {
    const product = await ProductStore.findById(id)
    if (!product) return null
    const nextStock = Math.max(0, product.stock + quantityDelta)
    const updated = persistProduct({
      ...product,
      stock: nextStock,
      warehouseLocation: 'Tamil Nadu Central Warehouse',
    })
    return updated
  },

  reserveStock: async (id: string, quantity: number) => {
    const product = await ProductStore.findById(id)
    if (!product) return null
    if (product.stock < quantity) {
      return null
    }
    return persistProduct({
      ...product,
      stock: product.stock - quantity,
      warehouseLocation: 'Tamil Nadu Central Warehouse',
    })
  },

  releaseStock: async (id: string, quantity: number) => {
    const product = await ProductStore.findById(id)
    if (!product) return null
    return persistProduct({
      ...product,
      stock: product.stock + quantity,
      warehouseLocation: 'Tamil Nadu Central Warehouse',
    })
  },
}

ProductStore.init()
