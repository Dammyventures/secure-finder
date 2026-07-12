import axios from 'axios'

const STORAGE_KEYS = {
  TOKEN: 'secure_finder_token',
  REFRESH_TOKEN: 'secure_finder_refresh_token',
  CURRENT_USER: 'secure_finder_current_user'
}

const getApiUrl = (): string => {
  // ✅ On Vercel (production) always use the production URL
  if (import.meta.env.PROD) {
    const prodUrl = import.meta.env.VITE_API_URL_PROD
    if (!prodUrl) {
      console.error('❌ VITE_API_URL_PROD is not defined on Vercel! Falling back to hardcoded URL.')
      return 'https://secure-finder-backend.onrender.com/api'
    }
    return prodUrl
  }

  // In development, use localhost or the dev variable
  return import.meta.env.VITE_API_URL_DEV || 'http://localhost:5000/api'
}

const API_URL = getApiUrl()
console.log(`🔗 API URL: ${API_URL}`)

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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
    // Network errors
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

    // 401 Unauthorized – try refresh token
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
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject({
      error: error.response?.data?.error || {
        code: error.response?.status || 'UNKNOWN_ERROR',
        message: error.response?.data?.message || error.message || 'An error occurred'
      }
    })
  }
)

// Helper to test connection
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