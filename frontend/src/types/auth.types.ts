// ============================================
// USER TYPES
// ============================================

export type UserRole = 'user' | 'admin' | 'verifier' | 'moderator'
export type IdentityType = 'driving_license' | 'passport' | 'national_id' | 'other'
export type VerificationLevel = 'basic' | 'intermediate' | 'advanced'
export type VerificationStatus = 'pending' | 'processing' | 'verified' | 'rejected' | 'expired'
export type AccountStatus = 'active' | 'suspended' | 'pending_verification' | 'banned'
export type TwoFactorMethod = 'email' | 'sms' | 'authenticator' | 'none'
export type TwoFactorStatus = 'enabled' | 'disabled' | 'pending_setup'

// ============================================
// SESSION TYPES
// ============================================

export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  device: DeviceInfo
  ipAddress: string
  userAgent: string
  location?: GeoLocation
  lastActive: Date
  expiresAt: Date
  createdAt: Date
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  os: string
  browser: string
  isTrusted: boolean
  fingerprint?: string
}

export interface GeoLocation {
  ip: string
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
}

// ============================================
// USER INTERFACE
// ============================================

export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  avatar?: string
  bio?: string
  
  // Identity
  identityType: IdentityType
  identityNumber: string
  identityVerified: boolean
  verificationLevel: VerificationLevel
  verificationScore: number // 0-100
  
  // Security & Status
  role: UserRole
  accountStatus: AccountStatus
  twoFactorEnabled: boolean
  twoFactorMethod?: TwoFactorMethod
  isEmailVerified: boolean
  isPhoneVerified: boolean
  
  // Preferences
  preferences: UserPreferences
  notificationSettings: NotificationSettings
  privacySettings: PrivacySettings
  
  // Metadata
  lastLogin?: Date
  lastActive?: Date
  loginAttempts: number
  lockUntil?: Date
  sessions: Session[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

// ============================================
// PREFERENCES & SETTINGS
// ============================================

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'auto'
  timezone: string
  dateFormat: string
  currency: string
  measurementSystem: 'metric' | 'imperial'
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
}

export interface NotificationSettings {
  itemMatches: boolean
  verificationUpdates: boolean
  claimUpdates: boolean
  messages: boolean
  systemAnnouncements: boolean
  marketing: boolean
  securityAlerts: boolean
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'contacts' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowMessaging: boolean
  dataSharing: {
    analytics: boolean
    marketing: boolean
    thirdParties: boolean
  }
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
  deviceInfo?: Partial<DeviceInfo>
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  identityType: IdentityType
  identityNumber: string
  termsAccepted: boolean
  privacyPolicyAccepted: boolean
  marketingConsent: boolean
}

export interface AuthResponse {
  success: boolean
  token: string
  refreshToken: string
  user: User
  session: Session
  requiresTwoFactor?: boolean
  twoFactorMethod?: TwoFactorMethod
}

// ============================================
// PASSWORD MANAGEMENT
// ============================================

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordResetRequest {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

// ============================================
// TWO-FACTOR AUTHENTICATION
// ============================================

export interface TwoFactorSetup {
  method: TwoFactorMethod
  secret?: string
  qrCode?: string
  backupCodes: string[]
  phoneNumber?: string
}

export interface TwoFactorVerifyRequest {
  method: TwoFactorMethod
  code: string
  backupCode?: boolean
}

// ============================================
// VERIFICATION DOCUMENTS
// ============================================

export interface VerificationDocument {
  id: string
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address' | 'other'
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
  verified: boolean
  verificationData?: {
    confidence: number
    extractedData?: Record<string, any>
    matches?: boolean
  }
}

export interface VerificationRequest {
  id: string
  userId: string
  type: 'identity' | 'document' | 'address'
  status: VerificationStatus
  method: 'automated' | 'manual' | 'video_call'
  documents: VerificationDocument[]
  score: number
  verifiedBy?: string
  notes?: string
  metadata?: Record<string, any>
  submittedAt: Date
  processedAt?: Date
  expiresAt?: Date
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
  pagination?: PaginationInfo
  meta?: Record<string, any>
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export interface ActiveSession {
  id: string
  device: DeviceInfo
  location?: GeoLocation
  ipAddress: string
  lastActive: Date
  current: boolean
}

export interface RevokeSessionRequest {
  sessionId: string
  revokeAll?: boolean
}

// ============================================
// SECURITY & ACTIVITY
// ============================================

export interface SecurityEvent {
  id: string
  userId: string
  type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | 'verification' | 'suspicious_activity'
  action: string
  ipAddress: string
  userAgent: string
  location?: GeoLocation
  metadata?: Record<string, any>
  timestamp: Date
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  resourceType: 'item' | 'claim' | 'verification' | 'message' | 'profile'
  resourceId?: string
  details?: Record<string, any>
  ipAddress: string
  timestamp: Date
}

// ============================================
// CONSTANTS
// ============================================

export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  TWO_FACTOR_CODE_LENGTH: 6,
  VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
} as const

// ============================================
// AUTH CONTEXT TYPES
// ============================================

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  requiresTwoFactor: boolean
  twoFactorMethod?: TwoFactorMethod
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshToken: () => Promise<string>
  verifyTwoFactor: (code: string, method: TwoFactorMethod) => Promise<AuthResponse>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (data: PasswordResetRequest) => Promise<void>
  changePassword: (data: PasswordChangeRequest) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<User>
  verifyIdentity: () => Promise<VerificationRequest>
  getSessions: () => Promise<ActiveSession[]>
  revokeSession: (data: RevokeSessionRequest) => Promise<void>
}

// ============================================
// ERROR CODES
// ============================================

export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_SUSPENDED'
  | 'EMAIL_NOT_VERIFIED'
  | 'PHONE_NOT_VERIFIED'
  | 'REQUIRES_2FA'
  | 'INVALID_2FA_CODE'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'USER_EXISTS'
  | 'USER_NOT_FOUND'
  | 'NO_TOKEN'
  | 'NO_REFRESH_TOKEN'
  | 'ACCOUNT_BANNED'

// ============================================
// WEBSOCKET EVENTS
// ============================================

export interface SocketAuthEvents {
  'auth:login': (data: { user: User; session: Session }) => void
  'auth:logout': (data: { userId: string; reason: string }) => void
  'auth:session_expired': (data: { sessionId: string }) => void
  'auth:verification_update': (data: VerificationRequest) => void
  'auth:security_alert': (data: SecurityEvent) => void
}