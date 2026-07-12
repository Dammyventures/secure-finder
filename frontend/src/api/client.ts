// frontend/src/api/client.ts
import axios from 'axios'

const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token',
  CURRENT_USER: 'secure_finder_current_user'
}

const getApiUrl = () => {
  // Development (localhost)
  if (import.meta.env.DEV) {
    // Use the environment variable or fallback to localhost
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  }
  // Production
  return import.meta.env.VITE_API_URL_PROD || 'https://secure-finder-backend.onrender.com/api'
}

const API_URL = getApiUrl()
console.log(`🔗 API URL: ${API_URL}`)

// Create axios instance with proper configuration
export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Remove withCredentials if you're not using cookies
  // withCredentials: true, // Uncomment if using cookies for auth
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
    console.log('🔑 Token:', token ? '✅ Present' : '❌ Missing')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log the full request URL for debugging
    console.log('🌐 Full URL:', `${config.baseURL}${config.url}`)
    
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Backend might not be running')
      console.error('💡 Make sure your backend is running on:', API_URL)
      return Promise.reject({
        error: {
          code: 'NETWORK_ERROR',
          message: 'Cannot connect to server. Please make sure the backend is running.'
        }
      })
    }
    
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message)
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const originalRequest = error.config
      if (!originalRequest._retry) {
        originalRequest._retry = true
        try {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          if (!refreshToken) throw new Error('No refresh token')
          
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          
          localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          console.error('❌ Refresh token failed:', refreshError)
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
          // Redirect to login if on protected page
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }
    }
    
    // Return error with better structure
    return Promise.reject({
      error: error.response?.data?.error || {
        code: error.response?.status || 'UNKNOWN_ERROR',
        message: error.response?.data?.message || error.message || 'An error occurred'
      }
    })
  }
)

// Helper function to test connection
export const testConnection = async () => {
  try {
    console.log('🔍 Testing connection to:', API_URL)
    const response = await api.get('/health')
    console.log('✅ Connection successful:', response.data)
    return true
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    if (error.code === 'ERR_NETWORK') {
      console.error('💡 Make sure your backend is running on:', API_URL)
    }
    return false
  }
}

export default api