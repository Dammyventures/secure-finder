// User Role Types
export type UserRole = 'user' | 'admin' | 'verifier' | 'moderator'

// Identity Verification Types
export type IdentityType = 'driving_license' | 'passport' | 'national_id' | 'other'
export type VerificationLevel = 'basic' | 'intermediate' | 'advanced'
export type VerificationStatus = 'pending' | 'processing' | 'verified' | 'rejected' | 'expired'
export type AccountStatus = 'active' | 'suspended' | 'pending_verification' | 'banned'

// Two-Factor Authentication Types
export type TwoFactorMethod = 'email' | 'sms' | 'authenticator' | 'none'
export type TwoFactorStatus = 'enabled' | 'disabled' | 'pending_setup'

// Session Types
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

// User Interface
export interface User {
  // Core Information
  id: string
  email: string
  fullName: string
  phone: string
  avatar?: string
  bio?: string
  
  // Identity Information
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

// User Preferences
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

// Notification Settings
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
    startTime: string // "22:00"
    endTime: string   // "08:00"
  }
}

// Privacy Settings
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

// Authentication Credentials
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
  deviceInfo?: Partial<DeviceInfo>
}

// src/types/auth.types.ts
export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  identityType: 'driving_license' | 'passport' | 'national_id' | 'other'
  identityNumber: string
  termsAccepted: boolean
  privacyPolicyAccepted: boolean
  marketingConsent: boolean
}

// Authentication Response
export interface AuthResponse {
  success: boolean
  token: string
  refreshToken: string
  user: User
  requiresTwoFactor?: boolean
  twoFactorMethod?: TwoFactorMethod
  session: Session
}

// Password Management
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

// Two-Factor Authentication
export interface TwoFactorSetup {
  method: TwoFactorMethod
  secret?: string // For authenticator apps
  qrCode?: string // QR code data URL
  backupCodes: string[]
  phoneNumber?: string // For SMS
}

export interface TwoFactorVerifyRequest {
  method: TwoFactorMethod
  code: string
  backupCode?: boolean
}

// Verification Documents
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

// Verification Request
export interface VerificationRequest {
  id: string
  userId: string
  type: 'identity' | 'document' | 'address'
  status: VerificationStatus
  method: 'automated' | 'manual' | 'video_call'
  documents: VerificationDocument[]
  score: number
  verifiedBy?: string // Admin/Verifier ID
  notes?: string
  metadata?: Record<string, any>
  submittedAt: Date
  processedAt?: Date
  expiresAt?: Date
}

// API Error Responses
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Session Management
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

// Rate Limiting
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: Date
  window: string
}

// Security Events
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

// Activity Log
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

// Permission Types
export type Permission = 
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'item:create'
  | 'item:read'
  | 'item:update'
  | 'item:delete'
  | 'claim:create'
  | 'claim:read'
  | 'claim:update'
  | 'claim:delete'
  | 'verification:create'
  | 'verification:read'
  | 'verification:update'
  | 'verification:delete'
  | 'admin:dashboard'
  | 'admin:users'
  | 'admin:items'
  | 'admin:claims'
  | 'admin:verifications'

export interface RolePermission {
  role: UserRole
  permissions: Permission[]
}

// Token Types
export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  permissions: Permission[]
  sessionId: string
  iat: number
  exp: number
}

// API Response Types
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

// Form Validation Types
export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  custom?: (value: any) => boolean | string
}

// Auth Context Types
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

// WebSocket Auth Events
export interface SocketAuthEvents {
  'auth:login': (data: { user: User; session: Session }) => void
  'auth:logout': (data: { userId: string; reason: string }) => void
  'auth:session_expired': (data: { sessionId: string }) => void
  'auth:verification_update': (data: VerificationRequest) => void
  'auth:security_alert': (data: SecurityEvent) => void
}

// Constants
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

// Utility Types
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

export type AuthSuccessCode = 
  | 'LOGIN_SUCCESS'
  | 'REGISTRATION_SUCCESS'
  | 'LOGOUT_SUCCESS'
  | 'PASSWORD_RESET_SENT'
  | 'PASSWORD_RESET_SUCCESS'
  | 'PASSWORD_CHANGED'
  | 'PROFILE_UPDATED'
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'SESSION_REVOKED'

// Remove the duplicate export statements at the end since they're already exported above
// Also remove the default export that tries to use types as values

// Option 1: If you want a named export object, you can create a constant with all types as a reference:
export const AuthTypes = {
  // This can serve as documentation of available types
  User: {} as User,
  Session: {} as Session,
  LoginCredentials: {} as LoginCredentials,
  RegisterData: {} as RegisterData,
  AuthResponse: {} as AuthResponse,
  VerificationRequest: {} as VerificationRequest,
  SecurityEvent: {} as SecurityEvent,
  UserActivity: {} as UserActivity,
  ApiResponse: {} as ApiResponse,
  PaginationInfo: {} as PaginationInfo,
  AuthState: {} as AuthState,
  AuthActions: {} as AuthActions,
  AUTH_CONSTANTS
}

// Option 2: Or simply export all types and let users import them individually
// This is the recommended approach for TypeScript

// Export everything as a namespace for easier imports
export * as AuthType from './auth.types'