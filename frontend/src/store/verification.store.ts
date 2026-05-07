import { create } from 'zustand'
import { Verification } from '../types/verification.types'

interface VerificationState {
  verifications: Record<string, Verification>
  userVerifications: Record<string, string[]> // userId -> verificationIds
  isLoading: boolean
  error: string | null
  selectedVerification: string | null
  
  setVerifications: (verifications: Verification[]) => void
  addVerification: (verification: Verification) => void
  updateVerification: (verificationId: string, verificationData: Partial<Verification>) => void
  removeVerification: (verificationId: string) => void
  setUserVerifications: (userId: string, verificationIds: string[]) => void
  setSelectedVerification: (verificationId: string | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getVerification: (verificationId: string) => Verification | null
  getUserVerifications: (userId: string) => Verification[]
  getPendingVerifications: () => Verification[]
  clearVerifications: () => void
}

export const useVerificationStore = create<VerificationState>((set, get) => ({
  verifications: {},
  userVerifications: {},
  isLoading: false,
  error: null,
  selectedVerification: null,
  
  setVerifications: (verifications) => {
    const verificationsMap = verifications.reduce((acc, verification) => {
      acc[verification.id] = verification
      return acc
    }, {} as Record<string, Verification>)
    
    // Group by user
    const userMap: Record<string, string[]> = {}
    verifications.forEach((verification) => {
      if (!userMap[verification.userId]) {
        userMap[verification.userId] = []
      }
      userMap[verification.userId].push(verification.id)
    })
    
    set({ 
      verifications: verificationsMap,
      userVerifications: userMap,
    })
  },
  
  addVerification: (verification) =>
    set((state) => ({
      verifications: { ...state.verifications, [verification.id]: verification },
      userVerifications: {
        ...state.userVerifications,
        [verification.userId]: [
          ...(state.userVerifications[verification.userId] || []),
          verification.id,
        ],
      },
    })),
  
  updateVerification: (verificationId, verificationData) =>
    set((state) => {
      const existingVerification = state.verifications[verificationId]
      if (!existingVerification) return state
      
      return {
        verifications: {
          ...state.verifications,
          [verificationId]: { ...existingVerification, ...verificationData },
        },
      }
    }),
  
  removeVerification: (verificationId) =>
    set((state) => {
      const verification = state.verifications[verificationId]
      if (!verification) return state
      
      const { [verificationId]: removed, ...remainingVerifications } = state.verifications
      const userVerifications = [...(state.userVerifications[verification.userId] || [])]
      const userIndex = userVerifications.indexOf(verificationId)
      
      if (userIndex > -1) {
        userVerifications.splice(userIndex, 1)
      }
      
      return {
        verifications: remainingVerifications,
        userVerifications: {
          ...state.userVerifications,
          [verification.userId]: userVerifications,
        },
      }
    }),
  
  setUserVerifications: (userId, verificationIds) =>
    set((state) => ({
      userVerifications: {
        ...state.userVerifications,
        [userId]: verificationIds,
      },
    })),
  
  setSelectedVerification: (verificationId) => set({ selectedVerification: verificationId }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  getVerification: (verificationId) => get().verifications[verificationId] || null,
  
  getUserVerifications: (userId) => {
    const verifications = get().verifications
    const userVerificationIds = get().userVerifications[userId] || []
    return userVerificationIds.map((id) => verifications[id]).filter(Boolean)
  },
  
  getPendingVerifications: () => {
    const verifications = get().verifications
    return Object.values(verifications).filter(
      (v) => v.status === 'pending' || v.status === 'processing'
    )
  },
  
  clearVerifications: () => set({ verifications: {}, userVerifications: {} }),
}))