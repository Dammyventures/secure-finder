import axiosInstance from './axiosConfig'
import type { Verification, DocumentUpload } from '../types/verification.types';

export const verificationApi = {
  // Start identity verification
  startIdentityVerification: async (): Promise<Verification> => {
    const response = await axiosInstance.post('/verify/identity/start')
    return response.data.verification
  },

  // Upload verification documents
  uploadDocuments: async (
    verificationId: string,
    documents: DocumentUpload[]
  ): Promise<Verification> => {
    const formData = new FormData()
    
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`documents[${index}][type]`, doc.type)
        formData.append(`documents[${index}][file]`, doc.file)
        if (doc.description) {
          formData.append(`documents[${index}][description]`, doc.description)
        }
      }
    })
    
    const response = await axiosInstance.post(
      `/verify/identity/${verificationId}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data.verification
  },

  // Get verification status
  getVerificationStatus: async (verificationId: string): Promise<Verification> => {
    const response = await axiosInstance.get(`/verify/status/${verificationId}`)
    return response.data.verification
  },

  // Get user verification
  getUserVerification: async (userId: string): Promise<Verification[]> => {
    const response = await axiosInstance.get(`/verify/user/${userId}`)
    return response.data.verifications
  },

  // Request video verification
  requestVideoVerification: async (data: {
    itemId: string
    claimId: string
    scheduledTime: string
  }): Promise<{ verification: Verification; meetingLink: string }> => {
    const response = await axiosInstance.post('/verify/video/request', data)
    return response.data
  },

  // Complete video verification
  completeVideoVerification: async (verificationId: string): Promise<Verification> => {
    const response = await axiosInstance.post(`/verify/video/${verificationId}/complete`)
    return response.data.verification
  },

  // Cancel verification
  cancelVerification: async (verificationId: string): Promise<void> => {
    await axiosInstance.delete(`/verify/${verificationId}`)
  },

  // Verify OTP
  verifyOTP: async (otp: string): Promise<{ token: string }> => {
    const response = await axiosInstance.post('/verify/otp', { otp })
    return response.data
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => {
    await axiosInstance.post('/verify/resend-email')
  },
}