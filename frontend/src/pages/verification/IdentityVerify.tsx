import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, TorusKnot } from '@react-three/drei'
import {
  AlertCircle,
  Camera,
  CheckCircle,
  HelpCircle,
  Lock,
  Shield,
  Upload,
  XCircle,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Button from '../../components/common/UI/Button'
import DocumentUpload from '../../components/verification/DocumentUpload'
import VideoVerification from '../../components/verification/VideoVerification'
import VerificationStatus from '../../components/verification/VerificationStatus'
import { useAuth } from '../../contexts/AuthContext'
import { authApi } from '../../api/auth.api'
import socketService from '../../api/socket.api'

// ========== 3D BACKGROUND FOR VERIFICATION PAGE ==========
const Verification3DBackground: React.FC = () => {
  const groupRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.8} position={[-4, -2, -8]}>
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial 
            color="#8b5cf6"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.85}
            emissive="#4b0082"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
      
      <Float speed={0.6} rotationIntensity={0.4} floatIntensity={0.6} position={[5, 1, -10]}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial 
            color="#E5E4E2"
            distort={0.3}
            speed={1.2}
            roughness={0.15}
            metalness={0.9}
            emissive="#c4b5fd"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
      
      <TorusKnot args={[3.5, 0.08, 200, 32, 3, 4]} position={[0, -1, -12]}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          emissive="#4b0082"
          emissiveIntensity={0.3}
          metalness={0.85}
          roughness={0.15}
          transparent
          opacity={0.4}
        />
      </TorusKnot>
      
      <ThreeSparkles count={300} scale={[12, 12, 12]} size={0.05} speed={0.3} color="#E5E4E2" />
      <Stars radius={15} depth={50} count={1500} factor={5} fade />
    </group>
  )
}

// Validation schemas
const personalInfoSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2).max(100),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Date cannot be in the future'),
  nationality: yup.string().required('Nationality is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
})

const documentSchema = yup.object({
  identityType: yup
    .string()
    .oneOf(['passport', 'driving_license', 'national_id'] as const)
    .required('Please select an identity type'),
})

type VerificationStep = 
  | 'welcome' 
  | 'personal_info' 
  | 'document_select' 
  | 'document_upload' 
  | 'selfie_upload' 
  | 'video_verification' 
  | 'processing' 
  | 'success' 
  | 'failed'

interface PersonalInfoData {
  fullName: string
  dateOfBirth: Date
  nationality: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface DocumentData {
  identityType: 'passport' | 'driving_license' | 'national_id'
}

interface UploadedDocument {
  id: string
  type: 'front' | 'back' | 'selfie'
  file: File
  preview: string
  verified: boolean
  error?: string
}

interface VerificationStatusData {
  status: 'pending' | 'processing' | 'verified' | 'rejected'
  score: number
  message?: string
  estimatedTime?: string
  nextStep?: string
}

const IdentityVerify: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('welcome')
  const [verificationId, setVerificationId] = useState<string>('')
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatusData>({
    status: 'pending',
    score: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Personal info form - FIXED: Added as any to resolver
  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    formState: { errors: personalInfoErrors },
    setValue: setPersonalInfoValue,
  } = useForm<PersonalInfoData>({
    resolver: yupResolver(personalInfoSchema) as any,
  })

  // Document type form - FIXED: Added as any to resolver
  const {
    register: registerDocument,
    handleSubmit: handleSubmitDocument,
    formState: { errors: documentErrors },
    watch: watchDocumentType,
  } = useForm<DocumentData>({
    resolver: yupResolver(documentSchema) as any,
    defaultValues: {
      identityType: 'passport',
    },
  })
  
  const selectedDocumentType = watchDocumentType('identityType')

  useEffect(() => {
    if (user) {
      setPersonalInfoValue('fullName', user.fullName)
    }
  }, [user, setPersonalInfoValue])

  useEffect(() => {
    const unsubscribe = socketService.on('verification:status', (data: any) => {
      if (data.verificationId === verificationId) {
        setVerificationStatus({
          status: data.status,
          score: data.score || 0,
          message: data.message,
          estimatedTime: data.estimatedTime,
          nextStep: data.nextStep,
        })

        if (data.status === 'processing') {
          setCurrentStep('processing')
        } else if (data.status === 'verified') {
          setCurrentStep('success')
          toast.success('Identity verified successfully!')
        } else if (data.status === 'rejected') {
          setCurrentStep('failed')
          toast.error('Verification failed. Please try again.')
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [verificationId])

  const startVerification = async () => {
    try {
      setIsLoading(true)
      const verification = await authApi.startVerification()
      setVerificationId(verification.id)
      setCurrentStep('personal_info')
      toast.success('Verification process started')
    } catch (error: any) {
      toast.error(error.message || 'Failed to start verification')
    } finally {
      setIsLoading(false)
    }
  }

  // FIXED: Properly typed submit handler
  const submitPersonalInfo = async (data: PersonalInfoData) => {
    try {
      setIsLoading(true)
      console.log('Personal info submitted:', data)
      setCurrentStep('document_select')
    } catch (error: any) {
      toast.error('Failed to save personal information')
    } finally {
      setIsLoading(false)
    }
  }

  // FIXED: Properly typed submit handler
  const submitDocumentType = async (data: DocumentData) => {
    setCurrentStep('document_upload')
  }

  const handleDocumentUpload = async (files: File[], type: 'front' | 'back' | 'selfie') => {
    try {
      setIsLoading(true)
      
      const newDocuments: UploadedDocument[] = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        type,
        file,
        preview: URL.createObjectURL(file),
        verified: false,
      }))

      setUploadedDocuments(prev => [...prev, ...newDocuments])

      await new Promise(resolve => setTimeout(resolve, 1500))

      if (type === 'front' && uploadedDocuments.filter(d => d.type === 'back').length === 0) {
        toast('Please upload the back side of your document')
      } else if (type === 'back' && uploadedDocuments.filter(d => d.type === 'selfie').length === 0) {
        toast('Please upload a selfie with your document')
        setCurrentStep('selfie_upload')
      } else if (type === 'selfie') {
        toast.success('All documents uploaded successfully!')
        const randomValue = Math.random()
        const needsVideoVerification = randomValue > 0.7
        if (needsVideoVerification) {
          setCurrentStep('video_verification')
        } else {
          setCurrentStep('processing')
          simulateProcessing()
        }
      }
    } catch (error) {
      toast.error('Failed to upload document')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSingleFileUpload = async (file: File) => {
    let type: 'front' | 'back' | 'selfie' = 'front'
    if (currentStep === 'selfie_upload') {
      type = 'selfie'
    } else if (uploadedDocuments.some(doc => doc.type === 'front')) {
      type = 'back'
    }
    await handleDocumentUpload([file], type)
  }

  const simulateProcessing = () => {
    setTimeout(() => {
      setVerificationStatus({
        status: 'processing',
        score: 45,
        message: 'Analyzing documents...',
        estimatedTime: '2-3 minutes',
      })
    }, 1000)

    setTimeout(() => {
      setVerificationStatus({
        status: 'processing',
        score: 75,
        message: 'Cross-checking with databases...',
        estimatedTime: '1-2 minutes',
      })
    }, 3000)

    setTimeout(() => {
      setVerificationStatus({
        status: 'verified',
        score: 98,
        message: 'Identity verified successfully!',
      })
      setCurrentStep('success')
    }, 6000)
  }

  const steps = {
    welcome: { title: 'Identity Verification', subtitle: 'Secure your account and unlock all features', stepNumber: 1, totalSteps: 8 },
    personal_info: { title: 'Personal Information', subtitle: 'Please provide your personal details', stepNumber: 2, totalSteps: 8 },
    document_select: { title: 'Document Type', subtitle: 'Select the type of identity document you have', stepNumber: 3, totalSteps: 8 },
    document_upload: { title: 'Document Upload', subtitle: 'Upload photos of your identity document', stepNumber: 4, totalSteps: 8 },
    selfie_upload: { title: 'Selfie Verification', subtitle: 'Take a selfie with your document', stepNumber: 5, totalSteps: 8 },
    video_verification: { title: 'Video Verification', subtitle: 'Optional video call for enhanced security', stepNumber: 6, totalSteps: 8 },
    processing: { title: 'Processing', subtitle: 'We are verifying your identity', stepNumber: 7, totalSteps: 8 },
    success: { title: 'Verified!', subtitle: 'Your identity has been successfully verified', stepNumber: 8, totalSteps: 8 },
    failed: { title: 'Verification Failed', subtitle: 'We could not verify your identity', stepNumber: 8, totalSteps: 8 },
  }

  const currentStepConfig = steps[currentStep]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const verificationBenefits = [
    { icon: <Shield className="h-6 w-6" />, title: 'Enhanced Security', description: 'Protect your account from unauthorized access' },
    { icon: <CheckCircle className="h-6 w-6" />, title: 'Trust Building', description: 'Gain trust from other users in the community' },
    { icon: <Zap className="h-6 w-6" />, title: 'Full Access', description: 'Unlock all features including item claiming' },
    { icon: <Lock className="h-6 w-6" />, title: 'Secure Transactions', description: 'Safe and secure item transfers' },
  ]

  const documentTypes = [
    { id: 'passport', name: 'Passport', description: 'International passport', icon: '🛂', requirements: ['Clear photo of passport data page', 'All text must be readable'] },
    { id: 'driving_license', name: "Driver's License", description: 'Government-issued driver license', icon: '🚗', requirements: ['Front and back photos', 'Must not be expired'] },
    { id: 'national_id', name: 'National ID Card', description: 'National identification card', icon: '🪪', requirements: ['Front and back photos', 'All corners visible'] },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] overflow-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#E5E4E2" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
          <Verification3DBackground />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl mb-4"
          >
            <Shield className="w-10 h-10 text-[#4b0082]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
            {currentStepConfig.title}
          </h1>
          <p className="text-white/60 text-sm mt-2">{currentStepConfig.subtitle}</p>
        </motion.div>

        {/* Progress Bar */}
        {currentStep !== 'success' && currentStep !== 'failed' && (
          <motion.div variants={itemVariants} className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white/60">
                Step {currentStepConfig.stepNumber} of {currentStepConfig.totalSteps}
              </span>
              <span className="text-xs font-medium text-white/60">
                {Math.round((currentStepConfig.stepNumber / currentStepConfig.totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepConfig.stepNumber / currentStepConfig.totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          
          {/* WELCOME STEP */}
          {currentStep === 'welcome' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-28 h-28 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Shield className="h-14 w-14 text-[#E5E4E2]" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Secure Identity Verification
                  </h2>
                  <p className="text-white/60 mb-6">
                    Verify your identity to access all features of Secure Finder.
                    This helps prevent fraud and ensures a safe community for everyone.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {verificationBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{benefit.title}</h3>
                        <p className="text-xs text-white/50">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Security Info */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-[#E5E4E2] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-1">Your Data is Secure</h4>
                      <p className="text-xs text-white/50">
                        All documents are encrypted and processed securely. We comply with GDPR
                        and never share your personal information with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={startVerification}
                      size="lg"
                      className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] font-semibold px-8"
                      isLoading={isLoading}
                    >
                      Start Verification
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Verify Later
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* PERSONAL INFORMATION STEP - FIXED onSubmit */}
          {currentStep === 'personal_info' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Personal Information
                  </h2>
                  <p className="text-white/50 text-sm">
                    Please provide your personal details. This information must match your identity documents.
                  </p>
                </div>

                <form onSubmit={handleSubmitPersonalInfo(submitPersonalInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...registerPersonalInfo('fullName')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                        placeholder="John Doe"
                      />
                      {personalInfoErrors.fullName && (
                        <p className="text-red-400 text-xs mt-1">{personalInfoErrors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          {...registerPersonalInfo('dateOfBirth')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                        />
                        {personalInfoErrors.dateOfBirth && (
                          <p className="text-red-400 text-xs mt-1">{personalInfoErrors.dateOfBirth.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Nationality *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('nationality')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                          placeholder="e.g., American"
                        />
                        {personalInfoErrors.nationality && (
                          <p className="text-red-400 text-xs mt-1">{personalInfoErrors.nationality.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        {...registerPersonalInfo('address')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                        placeholder="Street address"
                      />
                      {personalInfoErrors.address && (
                        <p className="text-red-400 text-xs mt-1">{personalInfoErrors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('city')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                          placeholder="New York"
                        />
                        {personalInfoErrors.city && (
                          <p className="text-red-400 text-xs mt-1">{personalInfoErrors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('postalCode')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                          placeholder="10001"
                        />
                        {personalInfoErrors.postalCode && (
                          <p className="text-red-400 text-xs mt-1">{personalInfoErrors.postalCode.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('country')}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none"
                          placeholder="United States"
                        />
                        {personalInfoErrors.country && (
                          <p className="text-red-400 text-xs mt-1">{personalInfoErrors.country.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={() => setCurrentStep('welcome')} className="border-white/20 text-white hover:bg-white/10">
                      Back
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DOCUMENT SELECT STEP - FIXED onSubmit */}
          {currentStep === 'document_select' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Select Document Type
                  </h2>
                  <p className="text-white/50 text-sm">
                    Choose the type of identity document you want to use for verification.
                  </p>
                </div>

                <form onSubmit={handleSubmitDocument(submitDocumentType)}>
                  <div className="space-y-3 mb-8">
                    {documentTypes.map((docType) => (
                      <motion.label
                        key={docType.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className={`
                          flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${selectedDocumentType === docType.id
                            ? 'border-[#E5E4E2] bg-white/10'
                            : 'border-white/20 hover:border-white/40'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          value={docType.id}
                          {...registerDocument('identityType')}
                          className="mt-1 w-4 h-4 text-[#E5E4E2] focus:ring-[#E5E4E2]"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{docType.icon}</span>
                            <div>
                              <h3 className="font-bold text-white">{docType.name}</h3>
                              <p className="text-sm text-white/50">{docType.description}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 ml-9">
                            <p className="text-xs font-medium text-white/60 mb-2">Requirements:</p>
                            <ul className="text-xs text-white/40 space-y-1">
                              {docType.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>

                  {documentErrors.identityType && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-sm text-red-400">{documentErrors.identityType.message}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep('personal_info')} className="border-white/20 text-white hover:bg-white/10">
                      Back
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DOCUMENT UPLOAD STEP */}
          {currentStep === 'document_upload' && (
            <div className="max-w-3xl mx-auto">
              <DocumentUpload
                documentType={selectedDocumentType}
                onUpload={handleSingleFileUpload}
                description={`Please upload a clear photo of your ${selectedDocumentType}`}
                onRemove={() => {
                  if (uploadedDocuments.length > 0) {
                    const lastDocument = uploadedDocuments[uploadedDocuments.length - 1]
                    setUploadedDocuments(prev => prev.filter(doc => doc.id !== lastDocument.id))
                  }
                }}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('document_select')} className="border-white/20 text-white hover:bg-white/10">
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* SELFIE UPLOAD STEP */}
          {currentStep === 'selfie_upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-12 w-12 text-[#E5E4E2]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Take a Selfie
                  </h2>
                  <p className="text-white/50 text-sm">
                    Please take a clear selfie while holding your document next to your face.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400 mb-2">Important Guidelines</h4>
                      <ul className="text-sm text-yellow-300/70 space-y-1">
                        <li>• Hold your document next to your face</li>
                        <li>• Make sure your face and the document are clearly visible</li>
                        <li>• Good lighting is essential</li>
                        <li>• No filters or editing</li>
                        <li>• Document must not be expired</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center mb-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="text-white/60 mb-2">
                    Drag and drop your selfie here, or click to select
                  </p>
                  <p className="text-sm text-white/40 mb-4">
                    JPEG, PNG up to 5MB
                  </p>
                  <Button
                    onClick={() => {
                      const file = new File([''], 'selfie.jpg', { type: 'image/jpeg' })
                      handleDocumentUpload([file], 'selfie')
                    }}
                    variant="outline"
                    isLoading={isLoading}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Selfie or Upload
                  </Button>
                </div>

                {uploadedDocuments.filter(d => d.type === 'selfie').length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-white mb-3">Uploaded Selfie</h3>
                    <div className="flex flex-wrap gap-4">
                      {uploadedDocuments
                        .filter(d => d.type === 'selfie')
                        .map(doc => (
                          <div key={doc.id} className="relative">
                            <img
                              src={doc.preview}
                              alt="Selfie preview"
                              className="w-32 h-32 object-cover rounded-xl border-2 border-white/20"
                            />
                            {doc.verified && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('document_upload')} className="border-white/20 text-white hover:bg-white/10">
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (uploadedDocuments.filter(d => d.type === 'selfie').length === 0) {
                        toast.error('Please upload a selfie first')
                        return
                      }
                      setCurrentStep('video_verification')
                    }}
                    disabled={uploadedDocuments.filter(d => d.type === 'selfie').length === 0}
                    className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* VIDEO VERIFICATION STEP */}
          {currentStep === 'video_verification' && (
            <div className="max-w-3xl mx-auto">
              <VideoVerification
                verificationId={verificationId}
                onComplete={() => {
                  toast.success('Video verification completed!')
                  setCurrentStep('processing')
                  simulateProcessing()
                }}
                onCancel={() => {
                  setCurrentStep('selfie_upload')
                }}
              />
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('selfie_upload')}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  ← Back to Selfie Upload
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING STEP */}
          {currentStep === 'processing' && (
            <div className="max-w-3xl mx-auto">
              <VerificationStatus verificationId={verificationId} />
            </div>
          )}

          {/* SUCCESS STEP */}
          {currentStep === 'success' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Identity Verified!
                </h2>
                <p className="text-white/60 mb-6">
                  Your identity has been successfully verified. You now have access to all features.
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5 text-[#E5E4E2]" />
                    <span className="text-white font-medium">
                      Verification Score: {verificationStatus.score}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/report/lost')}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Report a Lost Item
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* FAILED STEP */}
          {currentStep === 'failed' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-white/60 mb-4">
                  {verificationStatus.message || 'We could not verify your identity.'}
                </p>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
                  <h4 className="font-medium text-red-400 mb-2">Possible reasons:</h4>
                  <ul className="text-sm text-red-300/70 space-y-1">
                    <li>• Documents are blurry or unclear</li>
                    <li>• Information mismatch</li>
                    <li>• Expired document</li>
                    <li>• Suspicious activity detected</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setCurrentStep('welcome')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                  >
                    Try Again
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/support')}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Help Section */}
        {currentStep !== 'success' && currentStep !== 'failed' && currentStep !== 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast('Help documentation will open in a new window')}
              className="text-white/40 hover:text-white/60"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Need Help?
            </Button>
            <p className="text-xs text-white/30 mt-2">
              Our verification process is secure and confidential. Read our{' '}
              <a href="/privacy" className="text-[#E5E4E2] hover:underline">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default IdentityVerify