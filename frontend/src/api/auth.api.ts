// src/api/auth.api.ts - FIXED VERSION with localStorage persistence

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
  PasswordResetRequest
} from '../types/auth.types'
import storage from '../utils/storage'

// Key for storing users in localStorage
const STORAGE_KEYS = {
  USERS: 'secure_finder_users',
  CURRENT_USER: 'secure_finder_current_user',
  SESSIONS: 'secure_finder_sessions'
}

// Helper to get users from localStorage
const getStoredUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS)
  if (usersJson) {
    return JSON.parse(usersJson)
  }
  
  // Initialize with demo user if no users exist
  const defaultUsers: User[] = [
    {
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers))
  return defaultUsers
}

// Helper to save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Helper to generate token
const generateToken = (userId: string, sessionId: string = Date.now().toString()): string => {
  return `mock-token-${userId}-${sessionId}-${Date.now()}`
}

// Helper to simulate network delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to get current timestamp
const now = () => new Date()

// Helper to create a session
const createSession = (userId: string, deviceInfo?: Partial<DeviceInfo>): Session => {
  return {
    id: Date.now().toString(),
    userId,
    token: generateToken(userId),
    refreshToken: generateToken(userId, 'refresh'),
    device: {
      type: deviceInfo?.type || 'desktop',
      os: deviceInfo?.os || navigator.platform,
      browser: deviceInfo?.browser || navigator.userAgent.split(' ')[0],
      isTrusted: deviceInfo?.isTrusted || false
    },
    ipAddress: '127.0.0.1',
    userAgent: navigator.userAgent,
    lastActive: now(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: now()
  }
}

// Auth API with mock implementation and localStorage persistence
export const authApi = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📝 Registering user:', data.email)
    await delay(1000)
    
    const users = getStoredUsers()
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === data.email)
    if (existingUser) {
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
        marketing: data.marketingConsent,
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
          marketing: data.marketingConsent,
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
    
    console.log('✅ Registration successful for:', data.email)
    console.log('📦 Users in storage:', users.length)
    
    return {
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      user: newUser,
      session: session
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 Logging in:', credentials.email)
    await delay(800)
    
    const users = getStoredUsers()
    console.log('📦 Available users:', users.map(u => u.email))
    
    // Find user
    const user = users.find(u => u.email === credentials.email)
    
    if (!user) {
      console.error('❌ User not found:', credentials.email)
      throw {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }
    }
    
    console.log('✅ User found:', user.email)
    
    // Check account status
    if (user.accountStatus === 'suspended') {
      throw {
        error: {
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your account has been suspended. Please contact support.'
        }
      }
    }
    
    if (user.accountStatus === 'banned') {
      throw {
        error: {
          code: 'ACCOUNT_BANNED',
          message: 'Your account has been banned.'
        }
      }
    }
    
    // For demo, accept any non-empty password
    if (!credentials.password || credentials.password.length < 1) {
      console.error('❌ Invalid password for:', credentials.email)
      throw {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      }
    }
    
    const session = createSession(user.id, credentials.deviceInfo)
    
    // Update user sessions
    user.sessions.push(session)
    user.lastLogin = now()
    user.loginAttempts = 0
    user.updatedAt = now()
    
    // Save updated user
    const userIndex = users.findIndex(u => u.id === user.id)
    users[userIndex] = user
    saveUsers(users)
    
    const token = session.token
    const refreshToken = session.refreshToken
    
    console.log('✅ Login successful for:', credentials.email)
    
    const response: AuthResponse = {
      success: true,
      token,
      refreshToken,
      user,
      session,
      requiresTwoFactor: user.twoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod
    }
    
    if (user.twoFactorEnabled) {
      response.token = ''
      response.refreshToken = ''
    }
    
    return response
  },

  // Logout
  logout: async (): Promise<void> => {
    console.log('🚪 Logging out')
    await delay(500)
    const token = storage.getToken()
    if (token) {
      const userId = token.split('-')[2]
      const users = getStoredUsers()
      const user = users.find(u => u.id === userId)
      if (user) {
        const sessionId = token.split('-')[3]
        user.sessions = user.sessions.filter(s => s.id !== sessionId)
        const userIndex = users.findIndex(u => u.id === userId)
        users[userIndex] = user
        saveUsers(users)
      }
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    console.log('👤 Getting current user')
    await delay(500)
    
    const token = storage.getToken()
    if (!token) {
      throw {
        error: {
          code: 'NO_TOKEN',
          message: 'No authentication token found'
        }
      }
    }
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw {
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      }
    }
    
    return user
  },

  // Validate email
  validateEmail: async (email: string): Promise<{ available: boolean }> => {
    await delay(500)
    const users = getStoredUsers()
    const exists = users.some(u => u.email === email)
    return { available: !exists }
  },

  // Validate phone
  validatePhone: async (phone: string): Promise<{ available: boolean }> => {
    await delay(500)
    const users = getStoredUsers()
    const exists = users.some(u => u.phone === phone)
    return { available: !exists }
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    await delay(500)
    const refreshToken = storage.getToken('session')
    if (!refreshToken) {
      throw {
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'No refresh token available'
        }
      }
    }
    
    const userId = refreshToken.split('-')[2]
    const newToken = generateToken(userId)
    
    return { token: newToken }
  },

  // Update profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    await delay(800)
    const token = storage.getToken()
    if (!token) throw new Error('Not authenticated')
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) throw new Error('User not found')
    
    users[userIndex] = { ...users[userIndex], ...profileData, updatedAt: now() }
    saveUsers(users)
    
    return users[userIndex]
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeRequest): Promise<void> => {
    console.log('Password change requested (mock)', passwordData)
    await delay(800)
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await delay(800)
    const users = getStoredUsers()
    const user = users.find(u => u.email === email)
    if (!user) {
      throw {
        error: {
          code: 'USER_NOT_FOUND',
          message: 'No user found with this email'
        }
      }
    }
  },

  // Reset password
  resetPassword: async (resetData: PasswordResetRequest): Promise<void> => {
    console.log('Password reset (mock)', resetData)
    await delay(800)
  },

  // Delete account
  deleteAccount: async (password: string): Promise<void> => {
    console.log('Account deletion requested (mock)', { password })
    await delay(1000)
    const token = storage.getToken()
    if (!token) throw new Error('Not authenticated')
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const filteredUsers = users.filter(u => u.id !== userId)
    saveUsers(filteredUsers)
    
    storage.clearSession()
  },

  // Two-Factor Authentication (simplified mocks)
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
    const token = storage.getToken()
    if (!token) throw new Error('No session')
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    
    if (!user) throw new Error('User not found')
    
    if (code.length !== 6) {
      throw {
        error: {
          code: 'INVALID_2FA_CODE',
          message: 'Invalid verification code'
        }
      }
    }
    
    const session = createSession(user.id)
    user.sessions.push(session)
    
    const userIndex = users.findIndex(u => u.id === userId)
    users[userIndex] = user
    saveUsers(users)
    
    return {
      success: true,
      token: session.token,
      refreshToken: session.refreshToken,
      user,
      session
    }
  },

  // Identity Verification
  startVerification: async (): Promise<VerificationRequest> => {
    await delay(500)
    const token = storage.getToken()
    if (!token) throw new Error('Not authenticated')
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    
    return {
      id: `verif_${Date.now()}`,
      userId: user.id,
      type: 'identity',
      status: 'pending',
      method: 'automated',
      documents: [],
      score: 0,
      submittedAt: now()
    }
  },

  uploadVerificationDocuments: async (verificationId: string, _documents: FormData): Promise<VerificationRequest> => {
    await delay(1000)
    return {
      id: verificationId,
      userId: '1',
      type: 'identity',
      status: 'processing',
      method: 'automated',
      documents: [],
      score: 75,
      submittedAt: now()
    }
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationRequest> => {
    await delay(300)
    return {
      id: verificationId,
      userId: '1',
      type: 'identity',
      status: 'processing',
      method: 'automated',
      documents: [],
      score: 75,
      submittedAt: now()
    }
  },

  // Session Management
  getActiveSessions: async (): Promise<ActiveSession[]> => {
    await delay(500)
    const token = storage.getToken()
    if (!token) return []
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return []
    
    const currentSessionId = token.split('-')[3]
    
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
    const token = storage.getToken()
    if (!token) return
    
    const userId = token.split('-')[2]
    const users = getStoredUsers()
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    if (revokeData.revokeAll) {
      const currentSessionId = token.split('-')[3]
      user.sessions = user.sessions.filter(s => s.id === currentSessionId)
    } else {
      user.sessions = user.sessions.filter(s => s.id !== revokeData.sessionId)
    }
    
    const userIndex = users.findIndex(u => u.id === userId)
    users[userIndex] = user
    saveUsers(users)
  },

  // Security Events
  getSecurityEvents: async (_limit: number = 50, _page: number = 1): Promise<SecurityEvent[]> => {
    await delay(300)
    return [
      {
        id: '1',
        userId: '1',
        type: 'login',
        action: 'Successful login',
        ipAddress: '192.168.1.1',
        userAgent: navigator.userAgent,
        timestamp: now()
      }
    ]
  },

  // User Activity
  getUserActivity: async (_limit: number = 50, _page: number = 1): Promise<UserActivity[]> => {
    await delay(300)
    return [
      {
        id: '1',
        userId: '1',
        action: 'Login',
        resourceType: 'profile',
        ipAddress: '192.168.1.1',
        timestamp: now()
      }
    ]
  },

  // Health check
  checkHealth: async (): Promise<{ api: boolean; database: boolean; uptime: number; timestamp: Date }> => {
    await delay(100)
    return {
      api: true,
      database: true,
      uptime: Math.floor(Date.now() / 1000),
      timestamp: now()
    }
  },

  // Ping
  ping: async (): Promise<number> => {
    const start = Date.now()
    await delay(50)
    return Date.now() - start
  }
}

export default authApi