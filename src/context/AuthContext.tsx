'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { logActivity } from '@/lib/activityLogger'
import { useNotification } from '@/context/NotificationContext'

interface AuthContextType {
  user: User | null
  loginWithGoogle: (nextPath?: string) => void
  refreshSession: () => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { notify } = useNotification()
  const prevUserRef = useRef<User | null>(null)

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' })
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser((data?.user as User | null) || null)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false))
  }, [])

  // Show welcome toast when user logs in
  useEffect(() => {
    const prev = prevUserRef.current
    if (!prev && user) {
      notify('success', `Welcome${user.name ? `, ${user.name.split(' ')[0]}` : ''}! 🌿`)
    }
    prevUserRef.current = user
  }, [user, notify])

  const loginWithGoogle = (nextPath?: string) => {
    const safeNext = nextPath && nextPath.startsWith('/') ? nextPath : '/dashboard'
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
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, refreshSession, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
