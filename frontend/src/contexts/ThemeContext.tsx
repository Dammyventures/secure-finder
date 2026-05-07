import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import  { getTheme, setTheme } from '../utils/storage'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme
  useEffect(() => {
    const storedTheme = getTheme()
    setThemeState(storedTheme)
    updateTheme(storedTheme)
  }, [])

  // Update theme when system preference changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        updateTheme('system')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Apply theme to document
  const applyTheme = (themeType: 'light' | 'dark') => {
    const root = document.documentElement
    
    if (themeType === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    setResolvedTheme(themeType)
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeType === 'dark' ? '#0f172a' : '#ffffff'
      )
    }
  }

  // Update theme based on preference
  const updateTheme = (themePreference: Theme) => {
    let themeToApply: 'light' | 'dark'
    
    if (themePreference === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      themeToApply = isDark ? 'dark' : 'light'
    } else {
      themeToApply = themePreference
    }
    
    applyTheme(themeToApply)
  }

  // Set theme function
  const handleSetTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setTheme(newTheme)
    updateTheme(newTheme)
  }

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    handleSetTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}