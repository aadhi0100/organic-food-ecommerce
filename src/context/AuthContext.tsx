'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { logActivity } from '@/lib/activityLogger'

interface AuthContextType {
  user: User | null
  loginWithGoogle: (nextPath?: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        return data?.user as User | null
      })
      .then((sessionUser) => {
        if (sessionUser) setUser(sessionUser)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const loginWithGoogle = (nextPath?: string) => {
    const safeNext = nextPath && nextPath.startsWith('/') ? nextPath : '/'
    window.location.href = `/api/auth/google/start?next=${encodeURIComponent(safeNext)}`
  }

  const logout = async () => {
    if (user) {
      logActivity.userLogout(user.id)
    }
    
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
