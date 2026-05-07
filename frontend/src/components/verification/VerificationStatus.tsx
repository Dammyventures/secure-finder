import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react'
import Button from '../common/UI/Button'

interface VerificationDocument {
  id: string
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  name: string
  url: string
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  comments?: string
}

type VerificationStatus = 'pending' | 'processing' | 'verified' | 'rejected' | 'expired'
type VerificationType = 'identity' | 'document' | 'video'
type VerificationLevel = 'basic' | 'intermediate' | 'advanced'

interface VerificationData {
  id: string
  status: VerificationStatus
  type: VerificationType
  submittedAt: Date
  completedAt: Date | null
  score: number
  level: VerificationLevel
  documents: VerificationDocument[]
  reviewer: { name: string; role: string } | null
  comments: string
}

interface VerificationStatusProps {
  verificationId: string
  onRetry?: () => void
  onViewDetails?: () => void
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  verificationId,
  onRetry,
  onViewDetails,
}) => {
  const [verification, setVerification] = useState<VerificationData>({
    id: verificationId,
    status: 'processing',
    type: 'identity',
    submittedAt: new Date(Date.now() - 3600000), // 1 hour ago
    completedAt: null,
    score: 0,
    level: 'basic',
    documents: [],
    reviewer: null,
    comments: '',
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch verification status
    const fetchVerificationStatus = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - in real app, this would come from API
        const mockData: VerificationData = {
          id: verificationId,
          status: Math.random() > 0.5 ? 'verified' : 'processing',
          type: 'identity',
          submittedAt: new Date(Date.now() - 3600000),
          completedAt: Math.random() > 0.5 ? new Date() : null,
          score: Math.floor(Math.random() * 100),
          level: Math.random() > 0.7 ? 'advanced' : Math.random() > 0.4 ? 'intermediate' : 'basic',
          documents: [
            { id: '1', type: 'id_front', name: 'ID Front.jpg', url: '#', status: 'approved' },
            { id: '2', type: 'id_back', name: 'ID Back.jpg', url: '#', status: 'approved' },
            { id: '3', type: 'selfie', name: 'Selfie.jpg', url: '#', status: 'pending' },
          ],
          reviewer: Math.random() > 0.5 ? { name: 'Alex Johnson', role: 'Senior Verifier' } : null,
          comments: Math.random() > 0.5 ? 'Documents are clear and match the requirements.' : '',
        }
        
        setVerification(mockData)
      } catch (error) {
        console.error('Error fetching verification status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVerificationStatus()
    
    // Poll for updates every 10 seconds if still processing
    if (verification.status === 'processing') {
      const interval = setInterval(fetchVerificationStatus, 10000)
      return () => clearInterval(interval)
    }
  }, [verificationId, verification.status])

  const getStatusConfig = (status: VerificationStatus) => {
    const configs = {
      pending: {
        icon: <Clock className="w-5 h-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        label: 'Pending Review',
        description: 'Your verification is awaiting review.',
      },
      processing: {
        icon: <AlertCircle className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        label: 'In Progress',
        description: 'Your verification is being processed.',
      },
      verified: {
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Verified',
        description: 'Your identity has been verified.',
      },
      rejected: {
        icon: <XCircle className="w-5 h-5" />,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'Rejected',
        description: 'Your verification was not approved.',
      },
      expired: {
        icon: <Clock className="w-5 h-5" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        label: 'Expired',
        description: 'Your verification has expired.',
      },
    }

    return configs[status]
  }

  const getLevelConfig = (level: VerificationLevel) => {
    const configs = {
      basic: {
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        label: 'Basic',
        description: 'Email and phone verification',
      },
      intermediate: {
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        label: 'Intermediate',
        description: 'Document verification completed',
      },
      advanced: {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Advanced',
        description: 'Video verification completed',
      },
    }

    return configs[level]
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not completed'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
      id_front: '🪪',
      id_back: '🪪',
      selfie: '📸',
      proof_of_address: '🏠',
    }
    return icons[type] || '📄'
  }

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading verification status...</p>
      </div>
    )
  }

  const statusConfig = getStatusConfig(verification.status)
  const levelConfig = getLevelConfig(verification.level)

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Identity Verification Status
              </h2>
              <p className="text-gray-600">{statusConfig.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  ID: <span className="font-mono">{verification.id}</span>
                </span>
                <span className="text-sm text-gray-500">
                  Submitted: {formatDate(verification.submittedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${levelConfig.bgColor} ${levelConfig.color}`}>
            <span className="text-sm font-medium">{levelConfig.label} Level</span>
          </div>
        </div>
      </div>

      {/* Verification Score */}
      {verification.score > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Score</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Confidence Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-48 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${verification.score}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900">{verification.score}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">ID Match</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Face Match</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">90%</div>
                <div className="text-sm text-gray-600">Document Quality</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      {verification.documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {verification.documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {doc.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {getDocumentStatusIcon(doc.status)}
                    <span className="ml-2 text-sm capitalize">{doc.status}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewer Info */}
      {verification.reviewer && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Review Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Reviewed By</span>
              <span className="font-medium">{verification.reviewer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Role</span>
              <span className="font-medium">{verification.reviewer.role}</span>
            </div>
            {verification.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Completed</span>
                <span className="font-medium">{formatDate(verification.completedAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      {verification.comments && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-2">Reviewer Comments</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-gray-700">{verification.comments}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        {verification.status === 'rejected' && (
          <Button onClick={onRetry} variant="primary">
            <RefreshCw size={18} className="mr-2" />
            Retry Verification
          </Button>
        )}
        
        {verification.status === 'verified' && (
          <Button onClick={onViewDetails} variant="outline">
            <FileText size={18} className="mr-2" />
            View Verification Certificate
          </Button>
        )}

        <div className="space-x-3">
          <Button variant="outline" onClick={() => window.print()}>
            Print Status
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VerificationStatus