import { ITEM_CATEGORIES, CLAIM_TYPES, VERIFICATION_METHODS, USER_ROLES } from './constants'

/**
 * Format item category
 */
export const formatCategory = (category: string): string => {
  const found = ITEM_CATEGORIES.find(c => c.value === category)
  return found ? found.label : 'Other'
}

/**
 * Format claim type
 */
export const formatClaimType = (type: string): string => {
  const found = CLAIM_TYPES.find(c => c.value === type)
  return found ? found.label : 'Unknown'
}

/**
 * Format verification method
 */
export const formatVerificationMethod = (method: string): string => {
  const found = VERIFICATION_METHODS.find(m => m.value === method)
  return found ? found.label : 'Unknown'
}

/**
 * Format user role
 */
export const formatUserRole = (role: string): string => {
  switch (role) {
    case USER_ROLES.USER:
      return 'User'
    case USER_ROLES.ADMIN:
      return 'Administrator'
    case USER_ROLES.VERIFIER:
      return 'Verifier'
    default:
      return 'Unknown'
  }
}

/**
 * Format verification status
 */
export const formatVerificationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    verified: 'Verified',
    rejected: 'Rejected',
    expired: 'Expired',
  }
  return statusMap[status] || 'Unknown'
}

/**
 * Format claim status
 */
export const formatClaimStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    disputed: 'Disputed',
  }
  return statusMap[status] || 'Unknown'
}

/**
 * Format item status
 */
export const formatItemStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    open: 'Open',
    claimed: 'Claimed',
    matched: 'Matched',
    closed: 'Closed',
    resolved: 'Resolved',
  }
  return statusMap[status] || 'Unknown'
}

/**
 * Format verification level
 */
export const formatVerificationLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    basic: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }
  return levelMap[level] || 'Unknown'
}

/**
 * Get category icon
 */
export const getCategoryIcon = (category: string): string => {
  const found = ITEM_CATEGORIES.find(c => c.value === category)
  return found ? found.icon : '📦'
}

/**
 * Get status color class
 */
export const getStatusColorClass = (type: 'verification' | 'claim' | 'item', status: string): string => {
  const colors = {
    verification: {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    },
    claim: {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disputed: 'bg-red-100 text-red-800',
    },
    item: {
      open: 'bg-green-100 text-green-800',
      claimed: 'bg-yellow-100 text-yellow-800',
      matched: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800',
      resolved: 'bg-purple-100 text-purple-800',
    },
  }
  
  return colors[type][status] || 'bg-gray-100 text-gray-800'
}

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

/**
 * Format distance
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

/**
 * Format verification score
 */
export const formatVerificationScore = (score: number): string => {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Poor'
  return 'Very Poor'
}

/**
 * Get match confidence color
 */
export const getMatchConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'bg-green-100 text-green-800'
  if (confidence >= 75) return 'bg-blue-100 text-blue-800'
  if (confidence >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

/**
 * Format confidence percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}% confidence`
}