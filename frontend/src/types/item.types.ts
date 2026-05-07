export interface Item {
  id: string
  itemType: 'lost' | 'found'
  category: 'electronics' | 'documents' | 'jewelry' | 'bags' | 'clothing' | 'keys' | 'pets' | 'other'
  title: string
  description: string
  location: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
    address: string
    city: string
    country: string
  }
  dateLostFound: string
  images: Array<{
    url: string
    publicId?: string
    isVerified: boolean
    uploadedAt: string
  }>
  identifyingFeatures: string[]
  reward?: number
  status: 'open' | 'claimed' | 'matched' | 'closed' | 'resolved'
  reportedBy: {
    id: string
    fullName: string
    email: string
    phone: string
    profileImage?: string
  }
  claimedBy?: {
    id: string
    fullName: string
    email: string
    phone: string
    profileImage?: string
  }
  matchedItems?: string[]
  secureCode?: string
  isAnonymous: boolean
  metadata?: {
    color?: string
    brand?: string
    serialNumber?: string
    model?: string
    size?: string
    material?: string
  }
  verificationScore: number
  createdAt: string
  updatedAt: string
}

export interface CreateItemData {
  itemType: 'lost' | 'found'
  category: string
  title: string
  description: string
  location: {
    latitude: number
    longitude: number
    address: string
    city: string
    country: string
  }
  dateLostFound: string
  identifyingFeatures: string[]
  reward?: number
  isAnonymous?: boolean
  metadata?: {
    color?: string
    brand?: string
    serialNumber?: string
    model?: string
  }
}

export interface UpdateItemData {
  title?: string
  description?: string
  status?: string
  reward?: number
  metadata?: any
}

export interface ItemFilters {
  category?: string
  itemType?: 'lost' | 'found'
  status?: string
  city?: string
  country?: string
  dateFrom?: string
  dateTo?: string
  minReward?: number
  maxReward?: number
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  lat?: number
  lng?: number
  radius?: number // in kilometers
}

export interface ItemMatch {
  item: Item
  matchScore: number
  matchingFeatures: string[]
  distance: number // in kilometers
}