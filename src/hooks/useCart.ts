import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCart = create<CartStore>()(persist((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => set((state) => {
    const existing = state.items.find(i => i.productId === product.id)
    const currentTotal = state.items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Allow up to 100 items per product, 500 total items in cart
    if (existing) {
      if (existing.quantity + quantity > 100) {
        alert('Maximum 100 units per product allowed')
        return state
      }
      if (currentTotal + quantity > 500) {
        alert('Cart limit: 500 items maximum')
        return state
      }
      return {
        items: state.items.map(i => 
          i.productId === product.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
    }
    if (currentTotal + quantity > 500) {
      alert('Cart limit: 500 items maximum')
      return state
    }
    return { items: [...state.items, { productId: product.id, quantity, product }] }
  }),
  removeItem: (productId) => set((state) => ({ 
    items: state.items.filter((i) => i.productId !== productId) 
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i => 
      i.productId === productId ? { ...i, quantity } : i
    )
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const items = get().items
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  },
  getItemCount: () => {
    const items = get().items
    return items.reduce((sum, item) => sum + item.quantity, 0)
  },
}), { name: 'cart-storage' }))
