'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dim' | 'off'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const THEME_CYCLE: Theme[] = ['light', 'dim', 'off']

function applyTheme(theme: Theme) {
  const cl = document.documentElement.classList
  cl.remove('dark', 'dim', 'off')
  if (theme === 'dim') cl.add('dark', 'dim')
  if (theme === 'off') cl.add('dark', 'off')
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme | null) ?? 'light'
    const valid: Theme = THEME_CYCLE.includes(stored as Theme) ? (stored as Theme) : 'light'
    setTheme(valid)
    applyTheme(valid)
  }, [])

  const toggleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length] ?? 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
