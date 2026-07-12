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
    return import.meta.env.VITE_API_URL_DEV || 'http://localhost:5000/api'
  }
  // Production
  return import.meta.env.VITE_API_URL_PROD || 'https://secure-finder-backend.onrender.com/api'
}

const API_URL = getApiUrl()
console.log(`🔗 API URL: ${API_URL}`)

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message)
    
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
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api