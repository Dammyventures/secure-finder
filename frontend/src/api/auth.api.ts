// ============================================
// AUTH API - COMPLETE VERSION
// ============================================

import api from './client'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  VerificationRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  TwoFactorMethod,
  TwoFactorSetup,
  ActiveSession,
  RevokeSessionRequest,
  SecurityEvent,
  UserActivity
} from '../types/auth.types'

const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token',
  CURRENT_USER: 'secure_finder_current_user'
}

const now = () => new Date()

export const authApi = {
  // ==========================================
  // REGISTRATION - FIXED VERSION
  // ==========================================

  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📝 Registering user:', data.email)
    
    try {
      // ✅ Create a clean payload with only what backend expects
      // The backend likely expects: fullName, email, phone, password
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
        // ❌ DO NOT send: confirmPassword, termsAccepted, privacyPolicyAccepted, marketingConsent
        // These are frontend-only validation fields
      }
      
      console.log('📦 Sending payload to backend:', payload)
      
      const response = await api.post('/auth/register', payload)
      
      const result = response.data
      console.log('✅ Registration response:', result)
      
      if (result.data?.accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.data.refreshToken)
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result.data.user))
        console.log('✅ Tokens stored')
      }
      
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
      console.error('❌ Registration failed:', error.response?.data || error.message)
      console.error('❌ Full error:', error)
      
      // Extract meaningful error message
      let errorMessage = 'Registration failed. Please try again.'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw {
        error: {
          code: error.response?.data?.code || 'REGISTRATION_FAILED',
          message: errorMessage
        }
      }
    }
  },

  // ==========================================
  // LOGIN
  // ==========================================

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Logging in:', credentials.email)
    
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      const result = response.data
      
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
        session: result.data?.session,
        requiresTwoFactor: result.data?.requiresTwoFactor || false,
        twoFactorMethod: result.data?.twoFactorMethod
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      throw error
    }
  },

  // ==========================================
  // LOGOUT
  // ==========================================

  logout: async (): Promise<void> => {
    console.log('🚪 Logging out')
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.log('Logout error (ignored):', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  },

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) {
      throw { error: { code: 'NO_TOKEN', message: 'No authentication token found' } }
    }
    
    try {
      const response = await api.get('/auth/profile')
      const user = response.data.data
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      return user
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        throw { error: { code: 'UNAUTHORIZED', message: 'Please login again' } }
      }
      throw error
    }
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', profileData)
    const user = response.data.data
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    return user
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.delete('/auth/account', { data: { password } })
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },

  // ==========================================
  // PASSWORD MANAGEMENT
  // ==========================================

  changePassword: async (passwordData: PasswordChangeRequest): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (resetData: PasswordResetRequest): Promise<void> => {
    await api.post('/auth/reset-password', {
      token: resetData.token,
      newPassword: resetData.newPassword
    })
  },

  // ==========================================
  // VALIDATION
  // ==========================================

  validateEmail: async (email: string): Promise<{ available: boolean }> => {
    const response = await api.get(`/auth/validate-email?email=${encodeURIComponent(email)}`)
    return response.data
  },

  validatePhone: async (phone: string): Promise<{ available: boolean }> => {
    const response = await api.get(`/auth/validate-phone?phone=${encodeURIComponent(phone)}`)
    return response.data
  },

  // ==========================================
  // TWO-FACTOR AUTHENTICATION
  // ==========================================

  setupTwoFactor: async (method: TwoFactorMethod): Promise<TwoFactorSetup> => {
    const response = await api.post('/auth/2fa/setup', { method })
    return response.data.data
  },

  verifyTwoFactorSetup: async (code: string): Promise<{ success: boolean; backupCodes?: string[] }> => {
    const response = await api.post('/auth/2fa/verify-setup', { code })
    return response.data
  },

  disableTwoFactor: async (): Promise<void> => {
    await api.post('/auth/2fa/disable')
  },

  verifyTwoFactor: async (code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/2fa/verify', { code })
    const result = response.data
    
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
  },

  // ==========================================
  // IDENTITY VERIFICATION
  // ==========================================

  startVerification: async (): Promise<VerificationRequest> => {
    console.log('📋 Starting identity verification')
    const response = await api.post('/auth/verification/start')
    return response.data.data
  },

  uploadVerificationDocuments: async (
    verificationId: string,
    documents: FormData
  ): Promise<VerificationRequest> => {
    console.log('📎 Uploading verification documents for:', verificationId)
    const response = await api.post(`/auth/verification/${verificationId}/upload`, documents, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationRequest> => {
    console.log('📋 Getting verification status for:', verificationId)
    const response = await api.get(`/auth/verification/${verificationId}`)
    return response.data.data
  },

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  getActiveSessions: async (): Promise<ActiveSession[]> => {
    const response = await api.get('/auth/sessions')
    return response.data.data
  },

  revokeSession: async (revokeData: RevokeSessionRequest): Promise<void> => {
    if (revokeData.revokeAll) {
      await api.post('/auth/sessions/revoke-all')
    } else {
      await api.delete(`/auth/sessions/${revokeData.sessionId}`)
    }
  },

  // ==========================================
  // SECURITY & ACTIVITY
  // ==========================================

  getSecurityEvents: async (limit: number = 50, page: number = 1): Promise<SecurityEvent[]> => {
    const response = await api.get('/auth/security-events', { params: { limit, page } })
    return response.data.data
  },

  getUserActivity: async (limit: number = 50, page: number = 1): Promise<UserActivity[]> => {
    const response = await api.get('/auth/activity', { params: { limit, page } })
    return response.data.data
  },

  // ==========================================
  // TOKEN REFRESH
  // ==========================================

  refreshToken: async (): Promise<{ token: string }> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      throw { error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token available' } }
    }
    
    const response = await api.post('/auth/refresh', { refreshToken })
    const newToken = response.data.data.accessToken
    const newRefreshToken = response.data.data.refreshToken
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
    if (newRefreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
    }
    
    return { token: newToken }
  },

  // ==========================================
  // OTP VERIFICATION
  // ==========================================

  sendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Sending OTP to:', data.email)
    const response = await api.post('/auth/otp/send', data)
    return response.data
  },

  verifyOTP: async (data: { email: string; code: string }): Promise<{ success: boolean }> => {
    console.log('🔐 Verifying OTP for:', data.email)
    const response = await api.post('/auth/otp/verify', data)
    return response.data
  },

  resendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Resending OTP to:', data.email)
    const response = await api.post('/auth/otp/resend', data)
    return response.data
  },

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  checkHealth: async (): Promise<{ api: boolean; database: boolean; uptime: number; timestamp: Date }> => {
    const response = await api.get('/health')
    return {
      api: true,
      database: true,
      uptime: response.data.uptime || Math.floor(Date.now() / 1000),
      timestamp: new Date(response.data.timestamp || now())
    }
  },

  ping: async (): Promise<number> => {
    const start = Date.now()
    await api.get('/health')
    return Date.now() - start
  }
}

export default authApi