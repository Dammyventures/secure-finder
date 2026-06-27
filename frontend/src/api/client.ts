// frontend/src/api/client.ts
import axios from 'axios'

// ============================================
// STORAGE KEYS - Must match auth.api.ts
// ============================================

const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token',
  CURRENT_USER: 'secure_finder_current_user'
}

// ============================================
// API URL Configuration
// ============================================

const getApiUrl = () => {
  // Production (Vercel)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL_PROD || 'https://secure-finder-backend.onrender.com/api'
  }
  // Development (localhost)
  return import.meta.env.VITE_API_URL_DEV || 'http://localhost:5000/api'
}

const API_URL = getApiUrl()

console.log(`🔗 API URL: ${API_URL}`)

// ============================================
// Create Axios Instance
// ============================================

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ============================================
// Request Interceptor - Add Auth Token
// ============================================

api.interceptors.request.use(
  (config) => {
    // Use the same storage key as auth.api.ts
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// ============================================
// Response Interceptor - Handle Token Refresh
// ============================================

api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // If token expired (401) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Use the same storage key as auth.api.ts
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        console.log('🔄 Refreshing token...')
        
        // Attempt to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        })
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        
        // Store new tokens using the same keys
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        
        // Clear all auth data
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
        
        // Redirect to login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Handle other errors
    console.error('❌ API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api