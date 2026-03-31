import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  cartId: string
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => Promise<boolean>
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  hydrateProducts: () => Promise<void>
}

function createCartId() {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

async function syncCartAction(payload: Record<string, unknown>) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.error || 'Unable to update cart')
  }

  return response.json()
}

function applyServerCartState(
  set: (partial: Partial<CartStore> | ((state: CartStore) => Partial<CartStore>)) => void,
  snapshot: unknown,
  fallbackCartId: string,
  fallbackItems: CartItem[],
) {
  const serverCart = snapshot as { cartId?: unknown; items?: unknown } | null
  const hasItems = serverCart && Array.isArray(serverCart.items)
  if (!hasItems) {
    set({ cartId: fallbackCartId, items: fallbackItems })
    return
  }

  set({
    cartId: typeof serverCart.cartId === 'string' && serverCart.cartId ? serverCart.cartId : fallbackCartId,
    items: serverCart.items as CartItem[],
  })
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: '',
      items: [],

      addItem: async (product, quantity = 1) => {
        const previousItems = get().items
        const cartId = get().cartId || (() => {
          const nextId = createCartId()
          set({ cartId: nextId })
          return nextId
        })()

        const existing = previousItems.find((item) => item.productId === product.id)
        const currentTotal = previousItems.reduce((sum, item) => sum + item.quantity, 0)
        const requestedQuantity = existing ? existing.quantity + quantity : quantity

        if (product.stock <= 0) {
          return false
        }
        if (currentTotal + quantity > 500) {
          return false
        }
        if (requestedQuantity > 100) {
          return false
        }

        const nextItems = existing
          ? previousItems.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    product: {
                      ...product,
                      stock: Math.max(0, (item.product?.stock ?? product.stock) - quantity),
                    },
                  }
                : item,
            )
          : [...previousItems, { productId: product.id, quantity, product: { ...product, stock: Math.max(0, product.stock - quantity) } }]

        set({ items: nextItems })

        try {
          const snapshot = await syncCartAction({
            action: 'reserve',
            cartId,
            productId: product.id,
            quantity,
          })
          applyServerCartState(set, snapshot, cartId, nextItems)
          return true
        } catch {
          set({ items: previousItems })
          return false
        }
      },

      removeItem: (productId) => {
        const previousItems = get().items
        const cartId = get().cartId || createCartId()
        const removed = previousItems.find((item) => item.productId === productId)
        if (!removed) return

        set({ items: previousItems.filter((item) => item.productId !== productId) })

        void syncCartAction({
          action: 'remove',
          cartId,
          productId,
        })
          .then((snapshot) => {
            applyServerCartState(set, snapshot, cartId, previousItems.filter((item) => item.productId !== productId))
          })
          .catch(() => {
            set({ items: previousItems })
          })
      },

      updateQuantity: (productId, quantity) => {
        const previousItems = get().items
        const cartId = get().cartId || createCartId()
        const current = previousItems.find((item) => item.productId === productId)
        if (!current) return

        if (quantity < 1) {
          get().removeItem(productId)
          return
        }

        const product = current.product
        const cappedQuantity = product ? Math.min(Math.max(1, quantity), 100) : quantity
        if (product && cappedQuantity > product.stock + current.quantity) {
          return
        }

        const nextItems = previousItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: cappedQuantity,
                product: product
                  ? {
                      ...product,
                      stock: Math.max(0, product.stock + current.quantity - cappedQuantity),
                    }
                  : item.product,
              }
              : item,
        )

        set({ items: nextItems })

        void syncCartAction({
          action: 'set-quantity',
          cartId,
          productId,
          quantity: cappedQuantity,
        })
          .then((snapshot) => {
            applyServerCartState(set, snapshot, cartId, nextItems)
          })
          .catch(() => {
            set({ items: previousItems })
          })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items
        return items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
      },

      getItemCount: () => {
        const items = get().items
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },

      hydrateProducts: async () => {
        if (typeof window === 'undefined') return

        const current = get().items
        const needsHydration = current.filter((item) => {
          const p = item.product
          return !p || !p.name || !p.image || typeof p.price !== 'number'
        })
        if (needsHydration.length === 0) return

        const fetched = await Promise.all(
          needsHydration.map(async (item) => {
            try {
              const res = await fetch(`/api/products/${encodeURIComponent(item.productId)}`)
              if (!res.ok) return null
              const product = (await res.json()) as Product
              return { productId: item.productId, product }
            } catch {
              return null
            }
          }),
        )

        const map = new Map<string, Product>()
        for (const entry of fetched) {
          if (entry?.productId && entry.product) map.set(entry.productId, entry.product)
        }
        if (map.size === 0) return

        set((state) => ({
          items: state.items.map((item) => {
            const product = map.get(item.productId)
            return product ? { ...item, product } : item
          }),
        }))
      },
    }),
    {
      name: 'cart-storage',
      version: 3,
      migrate: (persisted: unknown) => {
        const p = persisted as { cartId?: unknown; items?: unknown[] } | null
        const items = Array.isArray(p?.items) ? p.items : []
        return {
          cartId: typeof p?.cartId === 'string' && p.cartId ? p.cartId : createCartId(),
          items: items
            .map((item: unknown) => {
              const i = item as Record<string, unknown> | null
              return {
                productId: String(i?.productId || ''),
                quantity: Math.max(1, Number(i?.quantity || 1)),
                product: i?.product && typeof i.product === 'object' ? i.product : undefined,
              }
            })
            .filter((item) => item.productId),
        }
      },
    },
  ),
)
