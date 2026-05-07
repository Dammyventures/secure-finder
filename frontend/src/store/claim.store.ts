import { create } from 'zustand'
import { Claim } from '../types/claim.types'

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
          ...(