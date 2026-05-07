import * as yup from 'yup'
import { VALIDATION_RULES } from './constants'

// Common validation schemas
export const emailSchema = yup
  .string()
  .required('Email is required')
  .email('Invalid email format')
  .matches(VALIDATION_RULES.EMAIL, 'Invalid email format')

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
  .matches(
    VALIDATION_RULES.PASSWORD_REGEX,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

export const phoneSchema = yup
  .string()
  .required('Phone number is required')
  .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number')

export const nameSchema = yup
  .string()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

export const identityNumberSchema = yup
  .string()
  .required('Identity number is required')
  .min(5, 'Identity number must be at least 5 characters')
  .max(20, 'Identity number must be less than 20 characters')

// Login validation schema
export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: yup.boolean(),
})

// Register validation schema
export const registerSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  fullName: nameSchema,
  phone: phoneSchema,
  identityType: yup
    .string()
    .required('Identity type is required')
    .oneOf(['driving_license', 'passport', 'national_id', 'other'], 'Invalid identity type'),
  identityNumber: identityNumberSchema,
  acceptTerms: yup
    .boolean()
    .required('You must accept the terms and conditions')
    .oneOf([true], 'You must accept the terms and conditions'),
})

// Forgot password schema
export const forgotPasswordSchema = yup.object({
  email: emailSchema,
})

// Reset password schema
export const resetPasswordSchema = yup.object({
  token: yup.string().required('Token is required'),
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

// Change password schema
export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

// Profile update schema
export const profileSchema = yup.object({
  fullName: nameSchema,
  phone: phoneSchema,
  profileImage: yup.string().url('Invalid image URL'),
})

// Item report schemas
export const lostItemSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['electronics', 'documents', 'jewelry', 'bags', 'clothing', 'keys', 'pets', 'other'], 'Invalid category'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  location: yup.object({
    latitude: yup.number().required('Location is required').min(-90).max(90),
    longitude: yup.number().required('Location is required').min(-180).max(180),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
  }),
  dateLostFound: yup
    .date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  identifyingFeatures: yup
    .array()
    .of(yup.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one identifying feature is required')
    .max(10, 'Maximum 10 features allowed'),
  reward: yup
    .number()
    .min(0, 'Reward cannot be negative')
    .max(10000, 'Reward cannot exceed $10,000'),
  isAnonymous: yup.boolean(),
  metadata: yup.object({
    color: yup.string().max(20),
    brand: yup.string().max(50),
    serialNumber: yup.string().max(50),
    model: yup.string().max(50),
  }),
})

export const foundItemSchema = lostItemSchema

// Claim schema
export const claimSchema = yup.object({
  itemId: yup.string().required('Item is required'),
  claimType: yup
    .string()
    .required('Claim type is required')
    .oneOf(['ownership', 'partial', 'witness'], 'Invalid claim type'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  evidence: yup
    .array()
    .of(
      yup.object({
        type: yup.string().required('Evidence type is required'),
        file: yup.mixed().required('File is required'),
        description: yup.string().max(200),
      })
    )
    .min(0)
    .max(5, 'Maximum 5 evidence files allowed'),
})

// Verification schema
export const verificationSchema = yup.object({
  verificationType: yup
    .string()
    .required('Verification type is required')
    .oneOf(['identity', 'item', 'claim'], 'Invalid verification type'),
  method: yup
    .string()
    .required('Method is required')
    .oneOf(['document_upload', 'video_call', 'biometric', 'otp'], 'Invalid method'),
  documents: yup
    .array()
    .of(
      yup.object({
        type: yup.string().required('Document type is required'),
        file: yup.mixed().required('File is required'),
      })
    )
    .when('method', {
      is: 'document_upload',
      then: (schema) => schema.min(1, 'At least one document is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  scheduledTime: yup
    .date()
    .when('method', {
      is: 'video_call',
      then: (schema) => schema.required('Scheduled time is required').min(new Date(), 'Time must be in the future'),
      otherwise: (schema) => schema.notRequired(),
    }),
})

// Search filters schema
export const searchFiltersSchema = yup.object({
  category: yup.string(),
  itemType: yup.string().oneOf(['lost', 'found', ''], 'Invalid item type'),
  status: yup.string(),
  city: yup.string(),
  country: yup.string(),
  dateFrom: yup.date(),
  dateTo: yup.date(),
  minReward: yup.number().min(0),
  maxReward: yup.number().min(0),
  search: yup.string(),
  lat: yup.number().min(-90).max(90),
  lng: yup.number().min(-180).max(180),
  radius: yup.number().min(0.1).max(100),
})

// Contact form schema
export const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
})

// Feedback schema
export const feedbackSchema = yup.object({
  rating: yup.number().required('Rating is required').min(1).max(5),
  comment: yup.string().required('Comment is required').min(10, 'Comment must be at least 10 characters'),
  type: yup.string().required('Feedback type is required'),
})

// File validation
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
  }
  
  if (file.size > maxSize) {
    return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
  }
  
  return null
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\D/g, '')
  if (sanitized.length < 13 || sanitized.length > 19) return false
  
  let sum = 0
  let alternate = false
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i))
    if (alternate) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    alternate = !alternate
  }
  return sum % 10 === 0
}

// ZIP/Postal code validation
export const isValidPostalCode = (code: string, country: string = 'US'): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
    AU: /^\d{4}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  }
  
  const pattern = patterns[country] || /^[\w\s-]{3,10}$/
  return pattern.test(code.trim())
}

// Age validation
export const isValidAge = (dateOfBirth: Date, minAge: number = 18): boolean => {
  const today = new Date()
  const age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= minAge
  }
  
  return age >= minAge
}

// Phone number validation with country code
export const validatePhoneWithCountry = (phone: string, countryCode: string = '+1'): boolean => {
  const phoneWithoutSpaces = phone.replace(/\s/g, '')
  const phoneWithCountry = phoneWithoutSpaces.startsWith('+') 
    ? phoneWithoutSpaces 
    : `${countryCode}${phoneWithoutSpaces}`
  
  return VALIDATION_RULES.PHONE.test(phoneWithCountry)
}

// Password strength validation
export const getPasswordStrength = (password: string): {
  score: number
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add lowercase letters')
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add uppercase letters')
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters')
  }
  
  // Strength mapping
  const strengthMap: Record<number, 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'> = {
    0: 'Very Weak',
    1: 'Very Weak',
    2: 'Weak',
    3: 'Fair',
    4: 'Good',
    5: 'Strong',
  }
  
  return {
    score,
    strength: strengthMap[score],
    feedback: feedback.length > 0 ? feedback : ['Password is strong!'],
  }
}