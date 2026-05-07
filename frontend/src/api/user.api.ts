import axiosInstance from './axiosConfig'
import type { User } from '../types/auth.types'

export const userApi = {
  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data.user
  },
  

  // Update user
  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${userId}`, data)
    return response.data.user
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await axiosInstance.post('/users/upload-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Get user statistics
  getUserStats: async (userId: string): Promise<any> => {
    const response = await axiosInstance.get(`/users/${userId}/stats`)
    return response.data
  },
}