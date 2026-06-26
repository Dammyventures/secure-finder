// ============================================
// AUTH API - COMPLETE VERSION
// ============================================

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
// UTILITY FUNCTIONS
// ============================================

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))
const now = () => new Date()

// Token generation
const generateToken = (userId: string, sessionId: string = Date.now().toString()): string => {
  return `mock-token-${userId}-${sessionId}-${Date.now()}`
}

// Session creation
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
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  USERS: 'secure_finder_users',
  CURRENT_USER: 'secure_finder_current_user',
  SESSIONS: 'secure_finder_sessions',
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token'
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
// AUTH API
// ============================================

export const authApi = {
  // ==========================================
  // REGISTRATION
  // ==========================================

  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📝 Registering user:', data.email)
    await delay(800)
    
    const users = getStoredUsers()
    
    if (users.some(u => u.email === data.email)) {
      throw {
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      }
    }
    
    const session = createSession(String(users.length + 1))
    
    const newUser: User = {
      id: String(users.length + 1),
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      identityType: data.identityType,
      identityNumber: data.identityNumber,
      identityVerified: false,
      verificationLevel: 'basic',
      verificationScore: 0,
      role: 'user',
      accountStatus: 'pending_verification',
      twoFactorEnabled: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      preferences: {
        language: 'en',
        theme: 'dark',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
        marketing: data.marketingConsent || false,
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
          marketing: data.marketingConsent || false,
          thirdParties: false
        }
      },
      loginAttempts: 0,
      sessions: [session],
      createdAt: now(),
      updatedAt: now()
    }
    
    users.push(newUser)
    saveUsers(users)
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, session.token)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken)
    
    console.log('✅ Registration successful for:', data.email)
    
    return {
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      user: newUser,
      session
    }
  },

  // ==========================================
  // LOGIN / LOGOUT
  // ==========================================

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Logging in:', credentials.email)
    await delay(800)
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === credentials.email)
    
    if (!user) {
      throw { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }
    }
    
    if (user.accountStatus === 'suspended') {
      throw { error: { code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended' } }
    }
    
    if (user.accountStatus === 'banned') {
      throw { error: { code: 'ACCOUNT_BANNED', message: 'Your account has been banned' } }
    }
    
    if (!credentials.password || credentials.password.length < 1) {
      throw { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }
    }
    
    const session = createSession(user.id, credentials.deviceInfo)
    user.sessions.push(session)
    user.lastLogin = now()
    user.loginAttempts = 0
    user.updatedAt = now()
    
    const userIndex = users.findIndex(u => u.id === user.id)
    users[userIndex] = user
    saveUsers(users)
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, session.token)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken)
    
    console.log('✅ Login successful for:', credentials.email)
    
    return {
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      user,
      session,
      requiresTwoFactor: user.twoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod
    }
  },

  logout: async (): Promise<void> => {
    console.log('🚪 Logging out')
    await delay(500)
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      const parts = token.split('-')
      const userId = parts.length > 2 ? parts[2] : null
      const sessionId = parts.length > 3 ? parts[3] : null
      
      if (userId) {
        const users = getStoredUsers()
        const user = users.find(u => u.id === userId)
        if (user && sessionId) {
          user.sessions = user.sessions.filter(s => s.id !== sessionId)
          const userIndex = users.findIndex(u => u.id === userId)
          users[userIndex] = user
          saveUsers(users)
        }
      }
    }
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
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
    
    const userId = getCurrentUserId()
    if (!userId) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    }
    
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    }
    
    return user
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    await delay(800)
    
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    const users = getStoredUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('User not found')
    
    users[userIndex] = { ...users[userIndex], ...profileData, updatedAt: now() }
    saveUsers(users)
    
    return users[userIndex]
  },

  deleteAccount: async (password: string): Promise<void> => {
    console.log('Account deletion requested (mock)', { password })
    await delay(1000)
    
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    const users = getStoredUsers()
    const filteredUsers = users.filter(u => u.id !== userId)
    saveUsers(filteredUsers)
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  // ==========================================
  // PASSWORD MANAGEMENT
  // ==========================================

  changePassword: async (passwordData: PasswordChangeRequest): Promise<void> => {
    console.log('Password change requested (mock)', passwordData)
    await delay(800)
  },

  forgotPassword: async (email: string): Promise<void> => {
    await delay(800)
    const users = getStoredUsers()
    const user = users.find(u => u.email === email)
    if (!user) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'No user found with this email' } }
    }
    console.log('Password reset email sent to:', email)
  },

  resetPassword: async (resetData: PasswordResetRequest): Promise<void> => {
    console.log('Password reset (mock)', resetData)
    await delay(800)
  },

  // ==========================================
  // VALIDATION
  // ==========================================

  validateEmail: async (email: string): Promise<{ available: boolean }> => {
    await delay(500)
    const users = getStoredUsers()
    return { available: !users.some(u => u.email === email) }
  },

  validatePhone: async (phone: string): Promise<{ available: boolean }> => {
    await delay(500)
    const users = getStoredUsers()
    return { available: !users.some(u => u.phone === phone) }
  },

  // ==========================================
  // TWO-FACTOR AUTHENTICATION
  // ==========================================

  setupTwoFactor: async (method: TwoFactorMethod): Promise<TwoFactorSetup> => {
    await delay(800)
    return {
      method,
      secret: 'MOCK_SECRET_KEY_12345',
      qrCode: 'data:image/png;base64,mock-qr-code-data',
      backupCodes: ['BACKUP-1234', 'BACKUP-5678', 'BACKUP-9012', 'BACKUP-3456', 'BACKUP-7890'],
      phoneNumber: method === 'sms' ? '+1234567890' : undefined
    }
  },

  verifyTwoFactorSetup: async (): Promise<{ success: boolean; backupCodes?: string[] }> => {
    await delay(500)
    return { success: true }
  },

  disableTwoFactor: async (): Promise<void> => {
    await delay(500)
  },

  verifyTwoFactor: async (code: string): Promise<AuthResponse> => {
    await delay(500)
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) throw new Error('No session')
    
    const userId = getCurrentUserId()
    if (!userId) throw new Error('User not found')
    
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    
    if (code.length !== 6) {
      throw { error: { code: 'INVALID_2FA_CODE', message: 'Invalid verification code' } }
    }
    
    const session = createSession(user.id)
    user.sessions.push(session)
    
    const userIndex = users.findIndex(u => u.id === userId)
    users[userIndex] = user
    saveUsers(users)
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, session.token)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken)
    
    return {
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      user,
      session
    }
  },

  // ==========================================
  // IDENTITY VERIFICATION
  // ==========================================

  startVerification: async (): Promise<VerificationRequest> => {
    await delay(500)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    return {
      id: `verif_${Date.now()}`,
      userId,
      type: 'identity',
      status: 'pending',
      method: 'automated',
      documents: [],
      score: 0,
      submittedAt: now()
    }
  },

  uploadVerificationDocuments: async (
    verificationId: string,
    documents: FormData
  ): Promise<VerificationRequest> => {
    await delay(1000)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    const mockDocuments: VerificationDocument[] = [
      {
        id: 'doc1',
        type: 'id_front',
        url: 'https://via.placeholder.com/300x200',
        fileName: 'id_front.jpg',
        fileSize: 1024 * 1024,
        mimeType: 'image/jpeg',
        uploadedAt: now(),
        verified: true,
        verificationData: {
          confidence: 95,
          extractedData: { name: 'John Doe', dob: '1990-01-01' },
          matches: true
        }
      }
    ]
    
    return {
      id: verificationId,
      userId,
      type: 'identity',
      status: 'processing',
      method: 'automated',
      documents: mockDocuments,
      score: 75,
      submittedAt: now()
    }
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationRequest> => {
    await delay(300)
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    
    return {
      id: verificationId,
      userId,
      type: 'identity',
      status: 'processing',
      method: 'automated',
      documents: [],
      score: 75,
      submittedAt: now()
    }
  },

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  getActiveSessions: async (): Promise<ActiveSession[]> => {
    await delay(500)
    
    const userId = getCurrentUserId()
    if (!userId) return []
    
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return []
    
    const currentSessionId = getCurrentSessionId()
    
    return user.sessions.map(session => ({
      id: session.id,
      device: session.device,
      ipAddress: session.ipAddress,
      lastActive: session.lastActive,
      current: session.id === currentSessionId
    }))
  },

  revokeSession: async (revokeData: RevokeSessionRequest): Promise<void> => {
    await delay(500)
    
    const userId = getCurrentUserId()
    if (!userId) return
    
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    const currentSessionId = getCurrentSessionId()
    
    if (revokeData.revokeAll) {
      user.sessions = user.sessions.filter(s => s.id === currentSessionId)
    } else {
      user.sessions = user.sessions.filter(s => s.id !== revokeData.sessionId)
    }
    
    const userIndex = users.findIndex(u => u.id === userId)
    users[userIndex] = user
    saveUsers(users)
  },

  // ==========================================
  // SECURITY & ACTIVITY
  // ==========================================

  getSecurityEvents: async (limit: number = 50, page: number = 1): Promise<SecurityEvent[]> => {
    await delay(300)
    return [{
      id: '1',
      userId: '1',
      type: 'login',
      action: 'Successful login',
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent || 'Unknown',
      timestamp: now()
    }]
  },

  getUserActivity: async (limit: number = 50, page: number = 1): Promise<UserActivity[]> => {
    await delay(300)
    return [{
      id: '1',
      userId: '1',
      action: 'Login',
      resourceType: 'profile',
      ipAddress: '192.168.1.1',
      timestamp: now()
    }]
  },

  // ==========================================
  // TOKEN REFRESH
  // ==========================================

  refreshToken: async (): Promise<{ token: string }> => {
    await delay(500)
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      throw { error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token available' } }
    }
    
    const userId = getCurrentUserId()
    if (!userId) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    }
    
    const newToken = generateToken(userId)
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
    
    return { token: newToken }
  },

  // ==========================================
  // OTP VERIFICATION - COMPLETE
  // ==========================================

  sendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Sending OTP to:', data.email, 'Type:', data.type)
    await delay(600)
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === data.email)
    
    if (data.type === 'verification' && user && user.isEmailVerified) {
      throw { error: { code: 'ALREADY_VERIFIED', message: 'Email already verified' } }
    }
    
    console.log('✅ OTP sent to:', data.email)
    
    return { 
      success: true, 
      message: 'Verification code sent to your email' 
    }
  },

  verifyOTP: async (data: { email: string; code: string }): Promise<{ success: boolean }> => {
    console.log('🔐 Verifying OTP for:', data.email, 'Code:', data.code)
    await delay(800)
    
    if (data.code.length !== 6) {
      throw { error: { code: 'INVALID_OTP', message: 'Invalid verification code' } }
    }
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === data.email)
    
    if (!user) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    }
    
    user.isEmailVerified = true
    user.accountStatus = 'active'
    user.identityVerified = true
    user.verificationScore = 50
    
    const userIndex = users.findIndex(u => u.id === user.id)
    users[userIndex] = user
    saveUsers(users)
    
    console.log('✅ Email verified for:', data.email)
    
    return { success: true }
  },

  resendOTP: async (data: { email: string; type?: 'verification' | 'password_reset' | 'two_factor' }): Promise<{ success: boolean; message: string }> => {
    console.log('📧 Resending OTP to:', data.email)
    await delay(600)
    
    const users = getStoredUsers()
    const user = users.find(u => u.email === data.email)
    
    if (!user) {
      throw { error: { code: 'USER_NOT_FOUND', message: 'User not found' } }
    }
    
    if (data.type === 'verification' && user.isEmailVerified) {
      throw { error: { code: 'ALREADY_VERIFIED', message: 'Email already verified' } }
    }
    
    console.log('✅ OTP resent to:', data.email)
    
    return { 
      success: true, 
      message: 'New verification code sent to your email' 
    }
  },

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  checkHealth: async (): Promise<{ api: boolean; database: boolean; uptime: number; timestamp: Date }> => {
    await delay(100)
    return {
      api: true,
      database: true,
      uptime: Math.floor(Date.now() / 1000),
      timestamp: now()
    }
  },

  ping: async (): Promise<number> => {
    const start = Date.now()
    await delay(50)
    return Date.now() - start
  }
}

export default authApi