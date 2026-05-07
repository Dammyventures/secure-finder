import { create } from 'zustand'
import type { Claim } from '../types/claim.types'

interface ClaimState {
  claims: Record<string, Claim>
  userClaims: Record<string, string[]> // userId -> claimIds
  itemClaims: Record<string, string[]> // itemId -> claimIds
  isLoading: boolean
  error: string | null
  selectedClaim: string | null
  
  setClaims: (claims: Claim[]) => void
  addClaim: (claim: Claim) => void
  updateClaim: (claimId: string, claimData: Partial<Claim>) => void
  removeClaim: (claimId: string) => void
  setUserClaims: (userId: string, claimIds: string[]) => void
  setItemClaims: (itemId: string, claimIds: string[]) => void
  setSelectedClaim: (claimId: string | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getClaim: (claimId: string) => Claim | null
  getUserClaims: (userId: string) => Claim[]
  getItemClaims: (itemId: string) => Claim[]
  getPendingClaims: () => Claim[]
  clearClaims: () => void
}

export const useClaimStore = create<ClaimState>((set, get) => ({
  claims: {},
  userClaims: {},
  itemClaims: {},
  isLoading: false,
  error: null,
  selectedClaim: null,
  
  setClaims: (claims) => {
    const claimsMap = claims.reduce((acc, claim) => {
      acc[claim.id] = claim
      return acc
    }, {} as Record<string, Claim>)
    
    // Group by user and item
    const userMap: Record<string, string[]> = {}
    const itemMap: Record<string, string[]> = {}
    
    claims.forEach((claim) => {
      // Group by user
      if (!userMap[claim.claimant.id]) {
        userMap[claim.claimant.id] = []
      }
      userMap[claim.claimant.id].push(claim.id)
      
      // Group by item
      if (!itemMap[claim.itemId]) {
        itemMap[claim.itemId] = []
      }
      itemMap[claim.itemId].push(claim.id)
    })
    
    set({ 
      claims: claimsMap,
      userClaims: userMap,
      itemClaims: itemMap,
    })
  },
  
  addClaim: (claim) =>
    set((state) => ({
      claims: { ...state.claims, [claim.id]: claim },
      userClaims: {
        ...state.userClaims,
        [claim.claimant.id]: [
          ...(state.userClaims[claim.claimant.id] || []),
          claim.id
        ]
      },
      itemClaims: {
        ...state.itemClaims,
        [claim.itemId]: [
          ...(state.itemClaims[claim.itemId] || []),
          claim.id
        ]
      }
    })),
  
  updateClaim: (claimId, claimData) =>
    set((state) => ({
      claims: {
        ...state.claims,
        [claimId]: { ...state.claims[claimId], ...claimData }
      }
    })),
  
  removeClaim: (claimId) =>
    set((state) => {
      const claim = state.claims[claimId]
      if (!claim) return state
      
      const newClaims = { ...state.claims }
      delete newClaims[claimId]
      
      // Remove from userClaims
      const userClaimIds = [...(state.userClaims[claim.claimant.id] || [])]
      const userClaimIndex = userClaimIds.indexOf(claimId)
      if (userClaimIndex !== -1) {
        userClaimIds.splice(userClaimIndex, 1)
      }
      
      // Remove from itemClaims
      const itemClaimIds = [...(state.itemClaims[claim.itemId] || [])]
      const itemClaimIndex = itemClaimIds.indexOf(claimId)
      if (itemClaimIndex !== -1) {
        itemClaimIds.splice(itemClaimIndex, 1)
      }
      
      return {
        claims: newClaims,
        userClaims: {
          ...state.userClaims,
          [claim.claimant.id]: userClaimIds
        },
        itemClaims: {
          ...state.itemClaims,
          [claim.itemId]: itemClaimIds
        }
      }
    }),
  
  setUserClaims: (userId, claimIds) =>
    set((state) => ({
      userClaims: { ...state.userClaims, [userId]: claimIds }
    })),
  
  setItemClaims: (itemId, claimIds) =>
    set((state) => ({
      itemClaims: { ...state.itemClaims, [itemId]: claimIds }
    })),
  
  setSelectedClaim: (claimId) =>
    set({ selectedClaim: claimId }),
  
  setIsLoading: (isLoading) =>
    set({ isLoading }),
  
  setError: (error) =>
    set({ error }),
  
  getClaim: (claimId) => {
    return get().claims[claimId] || null
  },
  
  getUserClaims: (userId) => {
    const state = get()
    const claimIds = state.userClaims[userId] || []
    return claimIds.map(id => state.claims[id]).filter(Boolean)
  },
  
  getItemClaims: (itemId) => {
    const state = get()
    const claimIds = state.itemClaims[itemId] || []
    return claimIds.map(id => state.claims[id]).filter(Boolean)
  },
  
  getPendingClaims: () => {
    const state = get()
    return Object.values(state.claims).filter(
      claim => claim.status === 'pending'
    )
  },
  
  clearClaims: () =>
    set({
      claims: {},
      userClaims: {},
      itemClaims: {},
      selectedClaim: null,
      error: null
    })
}))