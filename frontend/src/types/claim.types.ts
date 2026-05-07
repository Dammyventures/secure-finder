export interface Claim {
  id: string
  itemId: string
  item: {
    id: string
    title: string
    category: string
    images: Array<{ url: string }>
    reportedBy: {
      id: string
      fullName: string
    }
  }
  claimant: {
    id: string
    fullName: string
    email: string
    phone: string
    profileImage?: string
    identityVerified: boolean
  }
  claimType: 'ownership' | 'partial' | 'witness'
  description: string
  evidence: Array<{
    type: 'image' | 'document' | 'video' | 'receipt'
    url: string
    description?: string
    uploadedAt: string
  }>
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disputed'
  verificationLevel: 'low' | 'medium' | 'high'
  matchedFeatures: Array<{
    feature: string
    confidence: number
  }>
  adminNotes?: string
  resolvedBy?: {
    id: string
    fullName: string
  }
  secureHandoverCode?: string
  handoverCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClaimData {
  itemId: string
  claimType: 'ownership' | 'partial' | 'witness'
  description: string
  evidence?: File[]
}

export interface UpdateClaimData {
  description?: string
  status?: string
  adminNotes?: string
}

export interface ClaimEvidence {
  type: 'image' | 'document' | 'video' | 'receipt'
  file: File
  description?: string
}

export interface SecureCodeVerification {
  itemId: string
  secureCode: string
}

export interface HandoverDetails {
  claimId: string
  meetingLocation: string
  meetingTime: string
  contactPhone: string
  notes?: string
}