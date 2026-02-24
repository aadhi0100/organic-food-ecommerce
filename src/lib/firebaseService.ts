import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Product, User, Order, Shop } from '@/types'

export const FirebaseService = {
  // Products
  products: {
    getAll: async () => {
      const snapshot = await getDocs(collection(db, 'products'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]
    },
    add: async (product: Omit<Product, 'id'>) => {
      const docRef = await addDoc(collection(db, 'products'), product)
      return docRef.id
    },
    update: async (id: string, data: Partial<Product>) => {
      await updateDoc(doc(db, 'products', id), data)
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, 'products', id))
    }
  },

  // Users
  users: {
    getAll: async () => {
      const snapshot = await getDocs(collection(db, 'users'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[]
    },
    getByEmail: async (email: string) => {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const snapshot = await getDocs(q)
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User
    },
    add: async (user: Omit<User, 'id'>) => {
      const docRef = await addDoc(collection(db, 'users'), user)
      return docRef.id
    }
  },

  // Orders
  orders: {
    getAll: async () => {
      const snapshot = await getDocs(collection(db, 'orders'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]
    },
    add: async (order: Omit<Order, 'id'>) => {
      const docRef = await addDoc(collection(db, 'orders'), order)
      return docRef.id
    }
  },

  // Shops
  shops: {
    getAll: async () => {
      const snapshot = await getDocs(collection(db, 'shops'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shop[]
    }
  }
}
