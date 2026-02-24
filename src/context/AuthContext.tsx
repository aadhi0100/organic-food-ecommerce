'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { logActivity } from '@/lib/activityLogger'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const userData = JSON.parse(stored)
      setUser(userData)
      // Restore cookie on page load
      document.cookie = `userRole=${userData.role}; path=/; max-age=86400`
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const userData = await res.json()
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Set cookie for middleware
    document.cookie = `userRole=${userData.role}; path=/; max-age=86400`
    
    // Log activity
    logActivity.userLogin(userData.id, userData.email)
  }

  const logout = () => {
    if (user) {
      logActivity.userLogout(user.id)
    }
    setUser(null)
    localStorage.removeItem('user')
    // Remove cookie
    document.cookie = 'userRole=; path=/; max-age=0'
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
