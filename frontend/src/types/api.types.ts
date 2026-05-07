export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  timestamp: string
}

export interface UploadResponse {
  url: string
  publicId: string
  format: string
  size: number
  width?: number
  height?: number
}

export interface StatsResponse {
  totalUsers: number
  totalItems: number
  totalClaims: number
  resolvedClaims: number
  pendingVerifications: number
  activeItems: number
  recentActivities: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export interface SearchResult<T> {
  results: T[]
  total: number
  query: string
  filters?: Record<string, any>
}