export interface Verification {
  id: string
  userId: string
  verificationType: 'identity' | 'item' | 'claim'
  method: 'document_upload' | 'video_call' | 'biometric' | 'otp' | 'admin_review'
  status: 'pending' | 'processing' | 'verified' | 'rejected' | 'expired'
  documents: Array<{
    type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
    url: string
    publicId?: string
    verified: boolean
    verificationData?: any
  }>
  verificationScore: number
  verifiedBy?: {
    id: string
    fullName: string
    email: string
  }
  attempts: number
  expiresAt?: string
  metadata?: {
    itemId?: string
    claimId?: string
    scheduledTime?: string
    meetingLink?: string
  }
  createdAt: string
  completedAt?: string
}

export interface VerificationRequest {
  verificationType: 'identity' | 'item' | 'claim'
  method: 'document_upload' | 'video_call' | 'biometric'
  metadata?: any
}

export interface DocumentUpload {
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  file: File
  description?: string
}

export interface VideoVerificationRequest {
  itemId: string
  claimId: string
  scheduledTime: string
  timezone: string
}

export interface OTPVerification {
  otp: string
  verificationId?: string
}

export interface VerificationStatus {
  verification: Verification
  nextSteps: string[]
  estimatedCompletionTime?: string
  requiredDocuments?: string[]
}