// ============================================
// AUTH API - COMPLETE VERSION WITH REAL BACKEND
// ============================================

import api from './client'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Session,
  DeviceInfo,
  TwoFactorMethod,
  VerificationRequest,
  TwoFactorSetup,
  ActiveSession,
  RevokeSessionRequest,
  SecurityEvent,
  UserActivity,
  PasswordChangeRequest,
  PasswordResetRequest,
  VerificationDocument
} from '../types/auth.types'

// ============================================
// STORAGE KEYS - Must match client.ts
// ============================================

const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token',
  CURRENT_USER: 'secure_finder_current_user',
  USERS: 'secure_finder_users',
  SESSIONS: 'secure_finder_sessions'
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))
const now = () => new Date()

// Token generation (for mock fallback)
const generateToken = (userId: string, sessionId: string = Date.now().toString()): string => {
  return `mock-token-${userId}-${sessionId}-${Date.now()}`
}

// Session creation (for mock fallback)
const createSession = (userId: string, deviceInfo?: Partial<DeviceInfo>): Session => {
  return {
    id: Date.now().toString(),
    userId,
    token: generateToken(userId),
    refreshToken: generateToken(userId, 'refresh'),
    device: {
      type: deviceInfo?.type || 'desktop',
      os: deviceInfo?.os || navigator.platform || 'Unknown',
      browser: deviceInfo?.browser || navigator.userAgent?.split(' ')[0] || 'Unknown',
      isTrusted: deviceInfo?.isTrusted || false
    },
    ipAddress: '127.0.0.1',
    userAgent: navigator.userAgent || 'Unknown',
    lastActive: now(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: now()
  }
}

// ============================================
// STORAGE HELPERS
// ============================================

const getStoredUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS)
  if (usersJson) {
    return JSON.parse(usersJson)
  }
  
  const defaultUsers: User[] = [{
    id: '1',
    email: 'demo@securefinder.com',
    fullName: 'Demo User',
    phone: '+1234567890',
    identityType: 'national_id',
    identityNumber: 'ID123456789',
    identityVerified: true,
    verificationLevel: 'advanced',
    verificationScore: 95,
    role: 'user',
    accountStatus: 'active',
    twoFactorEnabled: false,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      language: 'en',
      theme: 'dark',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      measurementSystem: 'metric',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false
    },
    notificationSettings: {
      itemMatches: true,
      verificationUpdates: true,
      claimUpdates: true,
      messages: true,
      systemAnnouncements: true,
      marketing: false,
      securityAlerts: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    },
    privacySettings: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: false,
      allowMessaging: true,
      dataSharing: {
        analytics: true,
        marketing: false,
        thirdParties: false
      }
    },
    loginAttempts: 0,
    sessions: [],
    createdAt: now(),
    updatedAt: now()
  }]
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers))
  return defaultUsers
}

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (!token) return null
  const parts = token.split('-')
  return parts.length > 2 ? parts[2] : null
}

const getCurrentSessionId = (): string | null => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (!token) return null
  const parts = token.split('-')
  return parts.length > 3 ? parts[3] : null
}

// ============================================
// AUTH API - REAL BACKEND INTEGRATION
// ============================================

export const authApi = {
  // ==========================================
  // REGISTRATION
  // ==========================================

  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📝 Registering user:', data.email)
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/register', {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      })
      
      const result = response.data
      console.log('📦 Registration response:', result)
      
      // Store tokens from real backend using consistent keys
      if (result.data?.accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refreshToken)
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.data.user))
        console.log('✅ Tokens stored in localStorage')
      }
      
      console.log('✅ Registration successful for:', data.email)
      
      return {
        success: result.success,
        token: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
        user: result.data?.user,
        session: result.data?.session,
        requiresTwoFactor: result.data?.requiresTwoFactor || false,
        twoFactorMethod: result.data?.twoFactorMethod
      }
    } catch (error: any) {
      console.error('❌ Registration failed:', error)
      
      // Handle backend errors
      if (error.response) {
        console.error('❌ Error response data:', error.response.data)
        console.error('❌ Error response status:', error.response.status)
        
        throw {
          error: {
            code: error.response?.data?.code || 'REGISTRATION_FAILED',
            message: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
          }
        }
      }
      
      throw error
    }
  },

  // ==========================================
  // LOGIN / LOGOUT
  // ==========================================

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Logging in:', credentials.email)
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      const result = response.data
      console.log('📦 Login response:', result)
      
      // Store tokens from real backend using consistent keys
      if (result.data?.accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refreshToken)
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.data.user))
        console.log('✅ Tokens stored in localStorage')
      }
      
      console.log('✅ Login successful for:', credentials.email)
      
      return {
        success: result.success,
        token: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
        user: result.data?.user,
        session: result.data?.session,
        requiresTwoFactor: result.data?.requiresTwoFactor || false,
        twoFactorMethod: result.data?.twoFactorMethod
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      
      // Handle backend errors
      if (error.response) {
        console.error('❌ Error response data:', error.response.data)
        console.error('❌ Error response status:', error.response.status)
        
        if (error.response?.status === 401) {
          throw {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password'
            }
          }
        }
        
        throw {
          error: {
            code: error.response?.data?.code || 'LOGIN_FAILED',
            message: error.response?.data?.message || error.response?.data?.error || 'Login failed'
          }
        }
      }
      
      throw error
    }
  },

  logout: async (): Promise<void> => {
    console.log('🚪 Logging out')
    await delay(500)
    
    try {
      // REAL BACKEND CALL
      await api.post('/auth/logout')
      console.log('✅ Logout successful on backend')
    } catch (error) {
      console.log('Logout error (ignored):', error)
    } finally {
      // Always clear local storage using consistent keys
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      console.log('🧹 Local storage cleared')
    }
  },

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  getCurrentUser: async (): Promise<User> => {
    await delay(500)
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) {
      throw { error: { code: 'NO_TOKEN', message: 'No authentication token found' } }
    }
    
    try {
      // REAL BACKEND CALL
      const response = await api.get('/auth/profile')
      const user = response.data.data
      console.log('✅ Current user fetched:', user.email)
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      
      return user
    } catch (error: any) {
      console.error('❌ Failed to get current user:', error)
      
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        throw { error: { code: 'UNAUTHORIZED', message: 'Please login again' } }
      }
      
      throw error
    }
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    console.log('📝 Updating profile')
    await delay(800)
    
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    try {
      // REAL BACKEND CALL
      const response = await api.put('/auth/profile', profileData)
      const user = response.data.data
      console.log('✅ Profile updated for:', user.email)
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      
      return user
    } catch (error: any) {
      console.error('❌ Failed to update profile:', error)
      throw error
    }
  },

  deleteAccount: async (password: string): Promise<void> => {
    console.log('🗑️ Account deletion requested')
    await delay(1000)
    
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    try {
      // REAL BACKEND CALL
      await api.delete('/auth/account', { data: { password } })
      console.log('✅ Account deleted successfully')
      
      // Clear local storage using consistent keys
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    } catch (error: any) {
      console.error('❌ Failed to delete account:', error)
      throw error
    }
  },

  // ==========================================
  // PASSWORD MANAGEMENT
  // ==========================================

  changePassword: async (passwordData: PasswordChangeRequest): Promise<void> => {
    console.log('🔑 Password change requested')
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      console.log('✅ Password changed successfully')
    } catch (error: any) {
      console.error('❌ Failed to change password:', error)
      throw error
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    console.log('📧 Password reset requested for:', email)
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      await api.post('/auth/forgot-password', { email })
      console.log('✅ Password reset email sent to:', email)
    } catch (error: any) {
      console.error('❌ Failed to send password reset email:', error)
      throw error
    }
  },

  resetPassword: async (resetData: PasswordResetRequest): Promise<void> => {
    console.log('🔑 Password reset requested')
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      await api.post('/auth/reset-password', {
        token: resetData.token,
        newPassword: resetData.newPassword
      })
      console.log('✅ Password reset successfully')
    } catch (error: any) {
      console.error('❌ Failed to reset password:', error)
      throw error
    }
  },

  // ==========================================
  // VALIDATION
  // ==========================================

  validateEmail: async (email: string): Promise<{ available: boolean }> => {
    console.log('🔍 Validating email:', email)
    await delay(500)
    
    try {
      // REAL BACKEND CALL
      const response = await api.get(`/auth/validate-email?email=${encodeURIComponent(email)}`)
      console.log('✅ Email validation result:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to validate email:', error)
      return { available: false }
    }
  },

  validatePhone: async (phone: string): Promise<{ available: boolean }> => {
    console.log('🔍 Validating phone:', phone)
    await delay(500)
    
    try {
      // REAL BACKEND CALL
      const response = await api.get(`/auth/validate-phone?phone=${encodeURIComponent(phone)}`)
      console.log('✅ Phone validation result:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to validate phone:', error)
      return { available: false }
    }
  },

  // ==========================================
  // TWO-FACTOR AUTHENTICATION
  // ==========================================

  setupTwoFactor: async (method: TwoFactorMethod): Promise<TwoFactorSetup> => {
    console.log('🔐 Setting up 2FA with method:', method)
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/2fa/setup', { method })
      console.log('✅ 2FA setup successful')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to setup 2FA:', error)
      throw error
    }
  },

  verifyTwoFactorSetup: async (code: string): Promise<{ success: boolean; backupCodes?: string[] }> => {
    console.log('🔐 Verifying 2FA setup')
    await delay(500)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/2fa/verify-setup', { code })
      console.log('✅ 2FA setup verified')
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to verify 2FA setup:', error)
      throw error
    }
  },

  disableTwoFactor: async (): Promise<void> => {
    console.log('🔐 Disabling 2FA')
    await delay(500)
    
    try {
      // REAL BACKEND CALL
      await api.post('/auth/2fa/disable')
      console.log('✅ 2FA disabled')
    } catch (error: any) {
      console.error('❌ Failed to disable 2FA:', error)
      throw error
    }
  },

  verifyTwoFactor: async (code: string): Promise<AuthResponse> => {
    console.log('🔐 Verifying 2FA code')
    await delay(500)
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) throw new Error('No session')
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/2fa/verify', { code })
      const result = response.data
      console.log('✅ 2FA verification successful')
      
      if (result.data?.accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refreshToken)
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.data.user))
      }
      
      return {
        success: result.success,
        token: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
        user: result.data?.user,
        session: result.data?.session
      }
    } catch (error: any) {
      console.error('❌ Failed to verify 2FA:', error)
      throw error
    }
  },

  // ==========================================
  // IDENTITY VERIFICATION
  // ==========================================

  startVerification: async (): Promise<VerificationRequest> => {
    console.log('📋 Starting identity verification')
    await delay(500)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/verification/start')
      console.log('✅ Identity verification started')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to start verification:', error)
      throw error
    }
  },

  uploadVerificationDocuments: async (
    verificationId: string,
    documents: FormData
  ): Promise<VerificationRequest> => {
    console.log('📎 Uploading verification documents for:', verificationId)
    await delay(1000)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    try {
      // REAL BACKEND CALL
      const response = await api.post(`/auth/verification/${verificationId}/upload`, documents, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ Documents uploaded successfully')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to upload verification documents:', error)
      throw error
    }
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationRequest> => {
    console.log('📋 Getting verification status for:', verificationId)
    await delay(300)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    try {
      // REAL BACKEND CALL
      const response = await api.get(`/auth/verification/${verificationId}`)
      console.log('✅ Verification status retrieved')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to get verification status:', error)
      throw error
    }
  },

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  getActiveSessions: async (): Promise<ActiveSession[]> => {
    console.log('📋 Getting active sessions')
    await delay(500)
    
    const userId = getCurrentUserId()
    if (!userId) return []
    
    try {
      // REAL BACKEND CALL
      const response = await api.get('/auth/sessions')
      console.log('✅ Active sessions retrieved')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to get active sessions:', error)
      return []
    }
  },

  revokeSession: async (revokeData: RevokeSessionRequest): Promise<void> => {
    console.log('📋 Revoking session:', revokeData)
    await delay(500)
    
    const userId = getCurrentUserId()
    if (!userId) return
    
    try {
      // REAL BACKEND CALL
      if (revokeData.revokeAll) {
        await api.post('/auth/sessions/revoke-all')
        console.log('✅ All sessions revoked')
      } else {
        await api.delete(`/auth/sessions/${revokeData.sessionId}`)
        console.log('✅ Session revoked:', revokeData.sessionId)
      }
    } catch (error: any) {
      console.error('❌ Failed to revoke session:', error)
      throw error
    }
  },

  // ==========================================
  // SECURITY & ACTIVITY
  // ==========================================

  getSecurityEvents: async (limit: number = 50, page: number = 1): Promise<SecurityEvent[]> => {
    console.log('📋 Getting security events')
    await delay(300)
    
    try {
      // REAL BACKEND CALL
      const response = await api.get('/auth/security-events', {
        params: { limit, page }
      })
      console.log('✅ Security events retrieved')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to get security events:', error)
      // Return mock data as fallback
      return [{
        id: '1',
        userId: '1',
        type: 'login',
        action: 'Successful login',
        ipAddress: '192.168.1.1',
        userAgent: navigator.userAgent || 'Unknown',
        timestamp: now()
      }]
    }
  },

  getUserActivity: async (limit: number = 50, page: number = 1): Promise<UserActivity[]> => {
    console.log('📋 Getting user activity')
    await delay(300)
    
    try {
      // REAL BACKEND CALL
      const response = await api.get('/auth/activity', {
        params: { limit, page }
      })
      console.log('✅ User activity retrieved')
      return response.data.data
    } catch (error: any) {
      console.error('❌ Failed to get user activity:', error)
      // Return mock data as fallback
      return [{
        id: '1',
        userId: '1',
        action: 'Login',
        resourceType: 'profile',
        ipAddress: '192.168.1.1',
        timestamp: now()
      }]
    }
  },

  // ==========================================
  // TOKEN REFRESH
  // ==========================================

  refreshToken: async (): Promise<{ token: string }> => {
    console.log('🔄 Refreshing token')
    await delay(500)
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      throw { error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token available' } }
    }
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/refresh', { refreshToken })
      const newToken = response.data.data.accessToken
      const newRefreshToken = response.data.data.refreshToken
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
      }
      
      console.log('✅ Token refreshed successfully')
      return { token: newToken }
    } catch (error: any) {
      console.error('❌ Failed to refresh token:', error)
      throw error
    }
  },

  // ==========================================
  // OTP VERIFICATION - COMPLETE
  // ==========================================

  sendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Sending OTP to:', data.email, 'Type:', data.type)
    await delay(600)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/otp/send', data)
      console.log('✅ OTP sent to:', data.email)
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to send OTP:', error)
      throw error
    }
  },

  verifyOTP: async (data: { email: string; code: string }): Promise<{ success: boolean }> => {
    console.log('🔐 Verifying OTP for:', data.email, 'Code:', data.code)
    await delay(800)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/otp/verify', data)
      console.log('✅ OTP verified for:', data.email)
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to verify OTP:', error)
      throw error
    }
  },

  resendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Resending OTP to:', data.email)
    await delay(600)
    
    try {
      // REAL BACKEND CALL
      const response = await api.post('/auth/otp/resend', data)
      console.log('✅ OTP resent to:', data.email)
      return response.data
    } catch (error: any) {
      console.error('❌ Failed to resend OTP:', error)
      throw error
    }
  },

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  checkHealth: async (): Promise<{ api: boolean; database: boolean; uptime: number; timestamp: Date }> => {
    console.log('🏥 Checking health')
    await delay(100)
    
    try {
      // REAL BACKEND CALL
      const response = await api.get('/health')
      console.log('✅ Health check successful')
      return {
        api: true,
        database: true,
        uptime: response.data.uptime || Math.floor(Date.now() / 1000),
        timestamp: new Date(response.data.timestamp || now())
      }
    } catch (error: any) {
      console.error('❌ Health check failed:', error)
      return {
        api: false,
        database: false,
        uptime: Math.floor(Date.now() / 1000),
        timestamp: now()
      }
    }
  },

  ping: async (): Promise<number> => {
    console.log('🏓 Pinging API')
    const start = Date.now()
    try {
      await api.get('/health')
      const end = Date.now()
      const latency = end - start
      console.log('✅ Ping successful, latency:', latency, 'ms')
      return latency
    } catch (error) {
      console.error('❌ Ping failed:', error)
      return 1000
    }
  }
}

export default authApi