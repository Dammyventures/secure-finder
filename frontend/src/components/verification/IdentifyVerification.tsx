import React, { useState } from 'react'
import { Shield, Upload, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '../common/UI/Button'
import Alert from '../common/Feedback/Alert'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface VerificationStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

const IdentityVerification: React.FC = () => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<{
    idFront?: File
    idBack?: File
    selfie?: File
  }>({})

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: 'Start Verification',
      description: 'Begin the identity verification process',
      icon: <Shield size={24} />,
      completed: currentStep > 1,
    },
    {
      id: 2,
      title: 'Upload Documents',
      description: 'Upload your ID documents and selfie',
      icon: <Upload size={24} />,
      completed: currentStep > 2,
    },
    {
      id: 3,
      title: 'Live Selfie',
      description: 'Take a live selfie for biometric verification',
      icon: <Camera size={24} />,
      completed: currentStep > 3,
    },
    {
      id: 4,
      title: 'Verification Complete',
      description: 'Your identity has been verified',
      icon: <CheckCircle size={24} />,
      completed: currentStep > 4,
    },
  ]

  const handleFileUpload = (
    type: 'idFront' | 'idBack' | 'selfie',
    file: File
  ) => {
    setDocuments(prev => ({ ...prev, [type]: file }))
  }

  const startVerification = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(2)
      toast.success('Verification process started')
    } catch (error) {
      toast.error('Failed to start verification')
    } finally {
      setIsLoading(false)
    }
  }

  const submitDocuments = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(3)
      toast.success('Documents uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload documents')
    } finally {
      setIsLoading(false)
    }
  }

  const takeLiveSelfie = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement webcam API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(4)
      toast.success('Verification complete!')
    } catch (error) {
      toast.error('Failed to complete verification')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verify Your Identity</h2>
            <p className="text-gray-600 mb-6">
              Identity verification is required to ensure the security of our
              platform. This helps prevent fraud and ensures items are returned
              to their rightful owners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 border rounded-lg">
                <div className="text-blue-600 mb-2">🔒</div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and secure
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-blue-600 mb-2">⚡</div>
                <h3 className="font-semibold">Fast Process</h3>
                <p className="text-sm text-gray-600">
                  Usually completed within 24 hours
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-blue-600 mb-2">✓</div>
                <h3 className="font-semibold">Required</h3>
                <p className="text-sm text-gray-600">
                  Needed to report and claim items
                </p>
              </div>
            </div>
            <Button
              onClick={startVerification}
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Start Verification
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
            <Alert
              type="info"
              message="Please upload clear images of your ID documents. All documents must be valid and not expired."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ID Front */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🪪</div>
                <h3 className="font-semibold mb-2">Front of ID</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Government-issued ID
                </p>
                <input
                  type="file"
                  id="idFront"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload('idFront', e.target.files?.[0]!)
                  }
                  className="hidden"
                />
                <label
                  htmlFor="idFront"
                  className="cursor-pointer inline-block px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {documents.idFront ? 'Change' : 'Upload'}
                </label>
                {documents.idFront && (
                  <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                )}
              </div>

              {/* ID Back */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🪪</div>
                <h3 className="font-semibold mb-2">Back of ID</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Back side of your ID
                </p>
                <input
                  type="file"
                  id="idBack"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload('idBack', e.target.files?.[0]!)
                  }
                  className="hidden"
                />
                <label
                  htmlFor="idBack"
                  className="cursor-pointer inline-block px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {documents.idBack ? 'Change' : 'Upload'}
                </label>
                {documents.idBack && (
                  <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                )}
              </div>

              {/* Selfie */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="font-semibold mb-2">Selfie with ID</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your face holding the ID
                </p>
                <input
                  type="file"
                  id="selfie"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload('selfie', e.target.files?.[0]!)
                  }
                  className="hidden"
                />
                <label
                  htmlFor="selfie"
                  className="cursor-pointer inline-block px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {documents.selfie ? 'Change' : 'Upload'}
                </label>
                {documents.selfie && (
                  <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={submitDocuments}
                variant="primary"
                isLoading={isLoading}
                disabled={!documents.idFront || !documents.idBack || !documents.selfie}
              >
                Submit Documents
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Live Selfie Verification</h2>
            <p className="text-gray-600">
              Please allow camera access and take a live selfie for biometric verification.
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                <Camera size={48} className="text-gray-400" />
              </div>
            </div>

            <Alert
              type="warning"
              message="Make sure your face is clearly visible and well-lit."
            />

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
              >
                Back
              </Button>
              <Button
                onClick={takeLiveSelfie}
                variant="primary"
                isLoading={isLoading}
              >
                Take Selfie
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verification Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You can now report
              and claim items on our platform.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="text-green-600" />
                <span className="font-medium">Verification Level: Advanced</span>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="primary"
            >
              Go to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-100 text-green-600'
                      : currentStep === step.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.completed ? <CheckCircle /> : step.icon}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-grow h-1 bg-gray-200 mx-4">
                  <div
                    className={`h-full ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: step.completed ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {renderStepContent()}
      </div>
    </div>
  )
}

export default IdentityVerification