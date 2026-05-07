import { create } from 'zustand'
import { Item, ItemFilters } from '../types/item.types'

interface ItemState {
  items: Record<string, Item>
  filteredItems: string[] // Array of item IDs
  filters: ItemFilters
  isLoading: boolean
  error: string | null
  selectedItem: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  
  // Actions
  setItems: (items: Item[]) => void
  addItem: (item: Item) => void
  updateItem: (itemId: string, itemData: Partial<Item>) => void
  removeItem: (itemId: string) => void
  setFilteredItems: (itemIds: string[]) => void
  setFilters: (filters: ItemFilters) => void
  setSelectedItem: (itemId: string | null) => void
  setPagination: (pagination: Partial<ItemState['pagination']>) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getItem: (itemId: string) => Item | null
  getUserItems: (userId: string) => Item[]
  clearItems: () => void
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: {},
  filteredItems: [],
  filters: {
    page: 1,
    limit: 20,
  },
  isLoading: false,
  error: null,
  selectedItem: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  
  setItems: (items) => {
    const itemsMap = items.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<string, Item>)
    
    set({ items: itemsMap })
  },
  
  addItem: (item) =>
    set((state) => ({
      items: { ...state.items, [item.id]: item },
    })),
  
  updateItem: (itemId, itemData) =>
    set((state) => {
      const existingItem = state.items[itemId]
      if (!existingItem) return state
      
      return {
        items: {
          ...state.items,
          [itemId]: { ...existingItem, ...itemData },
        },
      }
    }),
  
  removeItem: (itemId) =>
    set((state) => {
      const { [itemId]: removed, ...remainingItems } = state.items
      return { items: remainingItems }
    }),
  
  setFilteredItems: (itemIds) => set({ filteredItems: itemIds }),
  
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  setSelectedItem: (itemId) => set({ selectedItem: itemId }),
  
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  getItem: (itemId) => get().items[itemId] || null,
  
  getUserItems: (userId) => {
    const items = get().items
    return Object.values(items).filter((item) => item.reportedBy.id === userId)
  },
  
  clearItems: () => set({ items: {}, filteredItems: [] }),
}))