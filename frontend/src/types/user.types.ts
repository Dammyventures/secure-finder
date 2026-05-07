export interface UserStats {
  totalItemsReported: number
  totalItemsFound: number
  totalClaimsMade: number
  successfulClaims: number
  verificationScore: number
  trustLevel: 'low' | 'medium' | 'high'
}

export interface UserActivity {
  id: string
  type: 'login' | 'logout' | 'item_reported' | 'claim_made' | 'verification_completed'
  description: string
  timestamp: string
  metadata?: any
}

export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  language: string
  theme: 'light' | 'dark' | 'system'
  privacy: {
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
  }
}

export interface UserSettings {
  preferences: UserPreferences
  security: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    sessionTimeout: number
  }
}