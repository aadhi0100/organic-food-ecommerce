import fs from 'fs'
import path from 'path'
import type { CartItem, Product } from '@/types'
import { dataPath, ensureDir, readJsonFile, writeJsonFile } from '@/lib/storage'
import { ProductStore } from '@/lib/productStore'

export type StoredCart = {
  cartId: string
  userId?: string
  items: CartItem[]
  updatedAt: string
  createdAt: string
}

const CARTS_ROOT = dataPath('carts')
const CARTS_BY_ID = dataPath('carts', 'by-id')
const CARTS_BY_USER = dataPath('carts', 'by-user')

function cartDir(cartId: string) {
  return path.join(CARTS_BY_ID, cartId)
}

function cartFile(cartId: string) {
  return path.join(cartDir(cartId), 'cart.json')
}

function userCartFile(userId: string) {
  return path.join(CARTS_BY_USER, `${userId}.json`)
}

async function loadCart(cartId: string): Promise<StoredCart | null> {
  const cart = readJsonFile<StoredCart | null>(cartFile(cartId), null)
  return cart || null
}

async function saveCart(cart: StoredCart) {
  ensureDir(CARTS_ROOT)
  ensureDir(CARTS_BY_ID)
  ensureDir(cartDir(cart.cartId))
  if (cart.userId) {
    ensureDir(CARTS_BY_USER)
  }
  writeJsonFile(cartFile(cart.cartId), cart)
  if (cart.userId) {
    writeJsonFile(userCartFile(cart.userId), { cartId: cart.cartId, updatedAt: cart.updatedAt })
  }
  return cart
}

async function ensureCart(cartId: string, userId?: string) {
  const existing = await loadCart(cartId)
  if (existing) {
    if (userId && existing.userId !== userId) {
      existing.userId = userId
      existing.updatedAt = new Date().toISOString()
      await saveCart(existing)
    }
    return existing
  }
  const created: StoredCart = {
    cartId,
    userId,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await saveCart(created)
  return created
}

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    quantity,
    product,
  }
}

export const CartStore = {
  init: () => {
    ensureDir(CARTS_ROOT)
    ensureDir(CARTS_BY_ID)
    ensureDir(CARTS_BY_USER)
  },

  getCart: async (cartId: string, userId?: string) => {
    return ensureCart(cartId, userId)
  },

  reserveItem: async (cartId: string, userId: string | undefined, productId: string, quantity: number) => {
    const product = await ProductStore.findById(productId)
    if (!product) {
      return { ok: false, error: 'Product not found' as const }
    }

    const cart = await ensureCart(cartId, userId)
    const existingItem = cart.items.find((item) => item.productId === productId)
    const currentQuantity = existingItem?.quantity || 0
    const nextQuantity = currentQuantity + quantity

    if (quantity <= 0) {
      return { ok: false, error: 'Invalid quantity' as const }
    }
    if (product.stock < quantity) {
      return { ok: false, error: 'Insufficient stock' as const, available: product.stock }
    }

    const reserved = await ProductStore.reserveStock(productId, quantity)
    if (!reserved) {
      return { ok: false, error: 'Unable to reserve stock' as const, available: product.stock }
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity
      existingItem.product = reserved
    } else {
      cart.items.push(toCartItem(reserved, quantity))
    }

    cart.userId = userId || cart.userId
    cart.updatedAt = new Date().toISOString()
    await saveCart(cart)
    return { ok: true, cart, product: reserved }
  },

  setItemQuantity: async (cartId: string, userId: string | undefined, productId: string, nextQuantity: number) => {
    const cart = await ensureCart(cartId, userId)
    const existingItem = cart.items.find((item) => item.productId === productId)
    const product = await ProductStore.findById(productId)

    if (!product || !existingItem) {
      return { ok: false, error: 'Item not found' as const }
    }
    if (nextQuantity < 1) {
      return CartStore.removeItem(cartId, userId, productId)
    }

    const delta = nextQuantity - existingItem.quantity
    if (delta === 0) {
      return { ok: true, cart }
    }
    if (delta > 0) {
      if (product.stock < delta) {
        return { ok: false, error: 'Insufficient stock' as const, available: product.stock }
      }
      const reserved = await ProductStore.reserveStock(productId, delta)
      if (!reserved) {
        return { ok: false, error: 'Unable to reserve stock' as const, available: product.stock }
      }
      existingItem.quantity = nextQuantity
      existingItem.product = reserved
    } else {
      const releaseAmount = Math.abs(delta)
      await ProductStore.releaseStock(productId, releaseAmount)
      existingItem.quantity = nextQuantity
      const refreshed = await ProductStore.findById(productId)
      if (refreshed) existingItem.product = refreshed
    }

    cart.updatedAt = new Date().toISOString()
    await saveCart(cart)
    return { ok: true, cart }
  },

  removeItem: async (cartId: string, userId: string | undefined, productId: string) => {
    const cart = await ensureCart(cartId, userId)
    const existingIndex = cart.items.findIndex((item) => item.productId === productId)
    if (existingIndex === -1) {
      return { ok: true, cart }
    }
    const existingItem = cart.items[existingIndex]
    if (!existingItem) {
      return { ok: true, cart }
    }
    cart.items.splice(existingIndex, 1)
    await ProductStore.releaseStock(productId, existingItem.quantity)
    cart.updatedAt = new Date().toISOString()
    await saveCart(cart)
    return { ok: true, cart }
  },

  clearCart: async (cartId: string, userId?: string) => {
    const cart = await ensureCart(cartId, userId)
    for (const item of cart.items) {
      await ProductStore.releaseStock(item.productId, item.quantity)
    }
    cart.items = []
    cart.updatedAt = new Date().toISOString()
    await saveCart(cart)
    try {
      const userIndex = userId ? userCartFile(userId) : null
      if (userIndex && fs.existsSync(userIndex)) fs.unlinkSync(userIndex)
      if (fs.existsSync(cartFile(cartId))) fs.unlinkSync(cartFile(cartId))
    } catch {
      // ignore cleanup failures
    }
    return cart
  },

  finalizeCart: async (cartId: string, userId?: string) => {
    const cart = await ensureCart(cartId, userId)
    cart.items = []
    cart.updatedAt = new Date().toISOString()
    await saveCart(cart)
    try {
      if (fs.existsSync(userCartFile(userId || cart.userId || ''))) {
        fs.unlinkSync(userCartFile(userId || cart.userId || ''))
      }
      if (fs.existsSync(cartFile(cartId))) fs.unlinkSync(cartFile(cartId))
    } catch {
      // ignore cleanup failures
    }
    return cart
  },

  syncCart: async (cartId: string, userId: string | undefined, items: Array<{ productId: string; quantity: number }>) => {
    const cart = await ensureCart(cartId, userId)
    const currentItems = new Map(cart.items.map((item) => [item.productId, item]))
    const nextItems: CartItem[] = []

    for (const item of items) {
      const existing = currentItems.get(item.productId)
      if (existing) {
        const updated = await CartStore.setItemQuantity(cartId, userId, item.productId, item.quantity)
        if (!updated.ok) return updated
        const refreshedCart = await loadCart(cartId)
        if (refreshedCart) {
          const refreshedItem = refreshedCart.items.find((entry) => entry.productId === item.productId)
          if (refreshedItem) nextItems.push(refreshedItem)
        }
      } else {
        const added = await CartStore.reserveItem(cartId, userId, item.productId, item.quantity)
        if (!added.ok) return added
        const refreshedCart = await loadCart(cartId)
        if (refreshedCart) {
          const refreshedItem = refreshedCart.items.find((entry) => entry.productId === item.productId)
          if (refreshedItem) nextItems.push(refreshedItem)
        }
      }
    }

    for (const existing of cart.items) {
      if (!items.some((item) => item.productId === existing.productId)) {
        await CartStore.removeItem(cartId, userId, existing.productId)
      }
    }

    const refreshed = await loadCart(cartId)
    return { ok: true, cart: refreshed || cart, items: nextItems }
  },
}

CartStore.init()
