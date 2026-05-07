import axiosInstance from './axiosConfig'
import type { Claim, CreateClaimData, UpdateClaimData } from '../types/claim.types'

export const claimApi = {
  // Create claim
  createClaim: async (data: CreateClaimData): Promise<Claim> => {
    const response = await axiosInstance.post('/claims', data)
    return response.data.claim
  },

  // Get claim by ID
  getClaimById: async (claimId: string): Promise<Claim> => {
    const response = await axiosInstance.get(`/claims/${claimId}`)
    return response.data.claim
  },

  // Get user claims
  getUserClaims: async (userId: string): Promise<Claim[]> => {
    const response = await axiosInstance.get(`/claims/user/${userId}`)
    return response.data.claims
  },

  // Get item claims
  getItemClaims: async (itemId: string): Promise<Claim[]> => {
    const response = await axiosInstance.get(`/claims/item/${itemId}`)
    return response.data.claims
  },

  // Update claim
  updateClaim: async (claimId: string, data: UpdateClaimData): Promise<Claim> => {
    const response = await axiosInstance.put(`/claims/${claimId}`, data)
    return response.data.claim
  },

  // Delete claim
  deleteClaim: async (claimId: string): Promise<void> => {
    await axiosInstance.delete(`/claims/${claimId}`)
  },

  // Submit evidence
  submitEvidence: async (claimId: string, files: File[]): Promise<Claim> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('evidence', file)
    })
    
    const response = await axiosInstance.post(
      `/claims/${claimId}/evidence`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data.claim
  },

  // Verify secure code
  verifySecureCode: async (itemId: string, secureCode: string): Promise<Claim> => {
    const response = await axiosInstance.post(`/claims/verify-code`, {
      itemId,
      secureCode,
    })
    
    return response.data.claim
  },

  // Accept claim
  acceptClaim: async (claimId: string): Promise<Claim> => {
    const response = await axiosInstance.post(`/claims/${claimId}/accept`)
    return response.data.claim
  },

  // Reject claim
  rejectClaim: async (claimId: string, reason: string): Promise<Claim> => {
    const response = await axiosInstance.post(`/claims/${claimId}/reject`, { reason })
    return response.data.claim
  },

  // Complete handover
  completeHandover: async (claimId: string): Promise<Claim> => {
    const response = await axiosInstance.post(`/claims/${claimId}/complete-handover`)
    return response.data.claim
  },
}