import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import type { User, LoginCredentials, RegisterData } from '../types/auth.types'
import storage from '../utils/storage'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = storage.getToken()
      const storedUser = storage.getUser()

      if (storedToken && storedUser) {
        setTokenState(storedToken)
        setUserState(storedUser as User)
        
        // Refresh user data
        try {
          const freshUser = await authApi.getCurrentUser()
          setUserState(freshUser)
          storage.setUser(freshUser)
        } catch (error) {
          console.error('Failed to refresh user:', error)
          storage.clearSession()
          setTokenState(null)
          setUserState(null)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      
      const response = await authApi.login(credentials)
      
      const authToken = response.token
      const userData = response.user
      
      // Store token and user
      if (authToken) {
        storage.setToken(authToken)
        storage.setToken(response.refreshToken, 'session')
      }
      storage.setUser(userData)
      setTokenState(authToken)
      setUserState(userData)
      
      // Check if 2FA is required
      if (response.requiresTwoFactor) {
      toast('Please complete two-factor authentication', { icon: '🔐' })
        navigate('/2fa-verify', { state: { method: response.twoFactorMethod } })
      } else {
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Login failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const response = await authApi.register(userData)
      
      const authToken = response.token
      const newUser = response.user
      
      // Store token and user
      storage.setToken(authToken)
      storage.setToken(response.refreshToken, 'session')
      storage.setUser(newUser)
      setTokenState(authToken)
      setUserState(newUser)
      
      toast.success('Registration successful! Please complete identity verification.')
      navigate('/verify-identity')
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      storage.clearSession()
      setTokenState(null)
      setUserState(null)
      
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authApi.updateProfile(userData)
      setUserState(updatedUser)
      storage.setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      const freshUser = await authApi.getCurrentUser()
      setUserState(freshUser)
      storage.setUser(freshUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}