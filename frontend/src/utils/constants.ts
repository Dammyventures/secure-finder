// Application Constants
export const APP_NAME = 'Secure Finder'
export const APP_VERSION = '1.0.0'
export const COMPANY_NAME = 'Secure Finder Systems'
export const SUPPORT_EMAIL = 'support@securefinder.com'
export const SUPPORT_PHONE = '+1 (555) 123-4567'

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
}

// File Configuration
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_IMAGES_PER_ITEM: 5,
  MAX_FILES_PER_UPLOAD: 10,
}

// Item Categories
export const ITEM_CATEGORIES = [
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'jewelry', label: 'Jewelry', icon: '💎' },
  { value: 'bags', label: 'Bags & Wallets', icon: '🎒' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'keys', label: 'Keys', icon: '🔑' },
  { value: 'pets', label: 'Pets', icon: '🐕' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const

// Item Statuses
export const ITEM_STATUS = {
  OPEN: 'open',
  CLAIMED: 'claimed',
  MATCHED: 'matched',
  CLOSED: 'closed',
  RESOLVED: 'resolved',
} as const

// Claim Types
export const CLAIM_TYPES = [
  { value: 'ownership', label: 'Ownership Claim', description: 'You are the owner of the item' },
  { value: 'partial', label: 'Partial Claim', description: 'You have information about the item' },
  { value: 'witness', label: 'Witness Claim', description: 'You saw someone lose/find the item' },
] as const

// Verification Methods
export const VERIFICATION_METHODS = [
  { value: 'document_upload', label: 'Document Upload', description: 'Upload identification documents' },
  { value: 'video_call', label: 'Video Call', description: 'Live video verification' },
  { value: 'biometric', label: 'Biometric', description: 'Facial recognition' },
  { value: 'otp', label: 'OTP Verification', description: 'One-time password' },
] as const

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  VERIFIER: 'verifier',
} as const

// Verification Status Colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
}

// Claim Status Colors
export const CLAIM_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  disputed: 'bg-red-100 text-red-800',
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
  REPORT_LOST: '/report/lost',
  REPORT_FOUND: '/report/found',
  ITEM_DETAIL: '/items/:id',
  VERIFICATION: '/verify',
  CLAIMS: '/claims',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ITEMS: '/admin/items',
  ADMIN_VERIFICATIONS: '/admin/verifications',
  ADMIN_CLAIMS: '/admin/claims',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  USER: 'secure_finder_user',
  THEME: 'secure_finder_theme',
  LANGUAGE: 'secure_finder_language',
  PREFERENCES: 'secure_finder_preferences',
} as const

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 51.505, lng: -0.09 },
  DEFAULT_ZOOM: 13,
  MAX_ZOOM: 18,
  MIN_ZOOM: 2,
  TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy hh:mm a',
  SHORT: 'MM/dd/yyyy',
  TIME: 'hh:mm a',
  API: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
} as const

// Theme Colors
export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    BACKGROUND: '#f8fafc',
    CARD: '#ffffff',
    TEXT: '#1e293b',
    TEXT_LIGHT: '#64748b',
  },
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  RADIUS: {
    SM: '0.25rem',
    DEFAULT: '0.375rem',
    MD: '0.5rem',
    LG: '0.75rem',
    XL: '1rem',
    FULL: '9999px',
  },
} as const

export default {
  APP_NAME,
  APP_VERSION,
  API_CONFIG,
  FILE_CONFIG,
  ITEM_CATEGORIES,
  ITEM_STATUS,
  CLAIM_TYPES,
  VERIFICATION_METHODS,
  USER_ROLES,
  STATUS_COLORS,
  CLAIM_STATUS_COLORS,
  ROUTES,
  STORAGE_KEYS,
  MAP_CONFIG,
  VALIDATION_RULES,
  DATE_FORMATS,
  THEME,
}