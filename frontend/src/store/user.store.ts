import { create } from 'zustand'
import { User } from '../types/auth.types'

interface UserState {
  currentUser: User | null
  users: Record<string, User>
  isLoading: boolean
  error: string | null
  
  setCurrentUser: (user: User | null) => void
  setUser: (userId: string, user: User) => void
  setUsers: (users: User[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getUser: (userId: string) => User | null
  updateUser: (userId: string, userData: Partial<User>) => void
  removeUser: (userId: string) => void
  clearUsers: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  users: {},
  isLoading: false,
  error: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setUser: (userId, user) => 
    set((state) => ({
      users: { ...state.users, [userId]: user },
    })),
  
  setUsers: (users) => {
    const usersMap = users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {} as Record<string, User>)
    
    set({ users: usersMap })
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  getUser: (userId) => get().users[userId] || null,
  
  updateUser: (userId, userData) =>
    set((state) => {
      const existingUser = state.users[userId]
      if (!existingUser) return state
      
      return {
        users: {
          ...state.users,
          [userId]: { ...existingUser, ...userData },
        },
      }
    }),
  
  removeUser: (userId) =>
    set((state) => {
      const { [userId]: removed, ...remainingUsers } = state.users
      return { users: remainingUsers }
    }),
  
  clearUsers: () => set({ users: {} }),
}))