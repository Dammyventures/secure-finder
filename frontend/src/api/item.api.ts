import axiosInstance from './axiosConfig'
import type { Item, CreateItemData, UpdateItemData, ItemFilters } from '../types/item.types'

export const itemApi = {
  // Get all items with filters
  getItems: async (filters?: ItemFilters): Promise<{ items: Item[]; total: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const response = await axiosInstance.get(`/items?${params.toString()}`)
    return response.data
  },

  // Get item by ID
  getItemById: async (itemId: string): Promise<Item> => {
    const response = await axiosInstance.get(`/items/${itemId}`)
    return response.data.item
  },

  // Report lost item
  reportLost: async (data: CreateItemData): Promise<Item> => {
    const response = await axiosInstance.post('/items/lost', data)
    return response.data.item
  },

  // Report found item
  reportFound: async (data: CreateItemData): Promise<Item> => {
    const response = await axiosInstance.post('/items/found', data)
    return response.data.item
  },

  // Update item
  updateItem: async (itemId: string, data: UpdateItemData): Promise<Item> => {
    const response = await axiosInstance.put(`/items/${itemId}`, data)
    return response.data.item
  },

  // Delete item
  deleteItem: async (itemId: string): Promise<void> => {
    await axiosInstance.delete(`/items/${itemId}`)
  },

  // Upload item images
  uploadItemImages: async (itemId: string, files: File[]): Promise<{ images: any[] }> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })
    
    const response = await axiosInstance.post(`/items/${itemId}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Search items
  searchItems: async (query: string, filters?: ItemFilters): Promise<{ items: Item[]; total: number }> => {
    const params = new URLSearchParams({ q: query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const response = await axiosInstance.get(`/items/search?${params.toString()}`)
    return response.data
  },

  // Get similar items
  getSimilarItems: async (itemId: string): Promise<Item[]> => {
    const response = await axiosInstance.get(`/items/${itemId}/similar`)
    return response.data.items
  },

  // Get user's items
  getUserItems: async (userId: string): Promise<Item[]> => {
    const response = await axiosInstance.get(`/users/${userId}/items`)
    return response.data.items
  },

  // Get nearby items
  getNearbyItems: async (lat: number, lng: number, radius: number = 10): Promise<Item[]> => {
    const response = await axiosInstance.get(
      `/items/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    )
    return response.data.items
  },
}