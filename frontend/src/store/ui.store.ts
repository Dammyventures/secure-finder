import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  modalOpen: boolean
  modalType: string | null
  modalData: any
  toastQueue: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>
  loading: boolean
  loadingMessage: string | null
  
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  openModal: (type: string, data?: any) => void
  closeModal: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  setLoading: (loading: boolean, message?: string) => void
  clearToastQueue: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  modalData: null,
  toastQueue: [],
  loading: false,
  loadingMessage: null,
  
  openSidebar: () => set({ sidebarOpen: true }),
  
  closeSidebar: () => set({ sidebarOpen: false }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openModal: (type, data) => set({ modalOpen: true, modalType: type, modalData: data }),
  
  closeModal: () => set({ modalOpen: false, modalType: null, modalData: null }),
  
  addToast: (message, type = 'info') => {
    const id = Date.now().toString()
    set((state) => ({
      toastQueue: [...state.toastQueue, { id, message, type }],
    }))
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 5000)
  },
  
  removeToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((toast) => toast.id !== id),
    })),
  
  setLoading: (loading, message = null) =>
    set({ loading, loadingMessage: message }),
  
  clearToastQueue: () => set({ toastQueue: [] }),
}))