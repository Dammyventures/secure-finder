import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  Stars, 
  Sparkles as ThreeSparkles, 
  TorusKnot,
  Points,
  PointMaterial,
  Ring
} from '@react-three/drei'
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
  ArrowRight,
  Crown,
  Diamond
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Button from '../../components/common/UI/Button'
import DocumentUpload from '../../components/verification/DocumentUpload'
import VideoVerification from '../../components/verification/VideoVerification'
import VerificationStatus from '../../components/verification/VerificationStatus'
import { useAuth } from '../../contexts/AuthContext'
import { authApi } from '../../api/auth.api'
import socketService from '../../api/socket.api'

// ========== ✨ NEW: COSMIC PARTICLE GALAXY FOR VERIFICATION ==========
const VerificationParticleGalaxy: React.FC = () => {
  const pointsRef = useRef<any>(null)
  const galaxyRef = useRef<any>(null)
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const radius = 1.5 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.35
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  })

  const [colorPositions] = useState(() => {
    const colors = new Float32Array(2000 * 3)
    const palette = [
      [0.956, 0.992, 1.0],   // #F4FDFF
      [0.11, 0.267, 0.557],   // #1C448E
      [0.576, 0.545, 0.631],  // #938BA1
      [0.956, 0.992, 1.0],   // #F4FDFF
    ]
    for (let i = 0; i < 2000; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return colors
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.012
      pointsRef.current.rotation.x = Math.sin(t * 0.018) * 0.035
    }
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.015
      galaxyRef.current.rotation.x = Math.sin(t * 0.012) * 0.025
    }
  })

  return (
    <group ref={galaxyRef}>
      {/* Main Particle Galaxy */}
      <Points ref={pointsRef} positions={particlePositions} colors={colorPositions} stride={3}>
        <PointMaterial
          transparent
          opacity={0.6}
          size={0.028}
          sizeAttenuation
          blending={2}
          depthWrite={false}
        />
      </Points>

      {/* Core Shield Orb */}
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.65, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#1C448E"
            distort={0.15}
            speed={1.2}
            roughness={0.05}
            metalness={0.95}
            emissive="#938BA1"
            emissiveIntensity={0.8}
            transparent
            opacity={0.55}
          />
        </Sphere>
      </Float>

      {/* Inner Glow Ring */}
      <Ring args={[0.95, 1.15, 64]} position={[0, 0, 0]} rotation={[Math.PI / 3.5, 0.25, 0]}>
        <meshStandardMaterial
          color="#F4FDFF"
          emissive="#1C448E"
          emissiveIntensity={0.25}
          metalness={0.9}
          transparent
          opacity={0.35}
        />
      </Ring>

      {/* Dual Orbiting Rings */}
      {[1, 2].map((i) => {
        const radius = 1.3 + i * 0.45
        return (
          <Float key={i} speed={0.35 + i * 0.1} rotationIntensity={0.25} floatIntensity={0.35}>
            <Ring
              args={[radius, radius + 0.04, 80]}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2.5 + i * 0.35, i * 0.35, 0]}
            >
              <meshStandardMaterial
                color={i === 1 ? "#938BA1" : "#1C448E"}
                emissive={i === 1 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.12}
                metalness={0.8}
                transparent
                opacity={0.2}
                wireframe={i === 2}
              />
            </Ring>
          </Float>
        )
      })}

      {/* Floating Shield Orbs */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.7 + Math.random() * 1.6
        const height = (Math.random() - 0.5) * 2.2
        return (
          <Float
            key={i + 100}
            speed={0.5 + Math.random() * 0.35}
            rotationIntensity={0.9}
            floatIntensity={0.9}
            position={[
              Math.cos(angle + i * 0.35) * radius,
              height,
              Math.sin(angle + i * 0.35) * radius
            ]}
          >
            <Sphere args={[0.045 + Math.random() * 0.045, 16, 16]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                distort={0.5}
                speed={2.2}
                metalness={0.9}
                emissive={i % 2 === 0 ? "#F4FDFF" : "#938BA1"}
                emissiveIntensity={0.35}
              />
            </Sphere>
          </Float>
        )
      })}

      <ThreeSparkles count={350} scale={[10, 10, 10]} size={0.045} speed={0.35} color="#F4FDFF" />
      <Stars radius={16} depth={55} count={1600} factor={4.5} fade />
    </group>
  )
}

// ========== 🌊 FLUID AURA BACKGROUND ==========
const FluidAuraBackground: React.FC = () => {
  const groupRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.18) * 0.12
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.07) * 0.018
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => {
        const size = 2.2 + i * 1.9
        const opacity = 0.028 - i * 0.005
        return (
          <Float
            key={i}
            speed={0.22 + i * 0.035}
            rotationIntensity={0.08}
            floatIntensity={0.22 + i * 0.035}
            position={[0, -0.35 + i * 0.22, -1.8 - i * 0.45]}
          >
            <Sphere args={[size, 32, 32]}>
              <MeshDistortMaterial
                color={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                distort={0.55 + i * 0.07}
                speed={0.35 + i * 0.035}
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={opacity}
                emissive={i % 2 === 0 ? "#1C448E" : "#938BA1"}
                emissiveIntensity={0.07}
              />
            </Sphere>
          </Float>
        )
      })}
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
  const [isHovered, setIsHovered] = useState(false)

  // Personal info form
  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    formState: { errors: personalInfoErrors },
    setValue: setPersonalInfoValue,
  } = useForm<PersonalInfoData>({
    resolver: yupResolver(personalInfoSchema) as any,
  })

  // Document type form
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] overflow-hidden">
      
      {/* 3D Background - New Galaxy */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} color="#F4FDFF" />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#938BA1" />
          <pointLight position={[2, -3, 4]} intensity={0.4} color="#1C448E" />
          <pointLight position={[0, 4, 0]} intensity={0.5} color="#F4FDFF" />
          <VerificationParticleGalaxy />
          <FluidAuraBackground />
        </Canvas>
      </div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1C448E]/30 via-transparent to-[#1C448E]/40" />
      
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
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F4FDFF] to-[#938BA1] rounded-2xl shadow-2xl mb-4 relative"
          >
            <Shield className="w-10 h-10 text-[#1C448E]" />
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-4 h-4 text-[#F4FDFF]" />
            </motion.div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent">
            {currentStepConfig.title}
          </h1>
          <p className="text-[#F4FDFF]/50 text-sm mt-2">{currentStepConfig.subtitle}</p>
        </motion.div>

        {/* Progress Bar */}
        {currentStep !== 'success' && currentStep !== 'failed' && (
          <motion.div variants={itemVariants} className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[#F4FDFF]/40">
                Step {currentStepConfig.stepNumber} of {currentStepConfig.totalSteps}
              </span>
              <span className="text-xs font-medium text-[#F4FDFF]/40">
                {Math.round((currentStepConfig.stepNumber / currentStepConfig.totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-[#F4FDFF]/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] rounded-full"
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
              <div 
                className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-28 h-28 bg-gradient-to-r from-[#1C448E]/20 to-[#938BA1]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Shield className="h-14 w-14 text-[#F4FDFF]" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#F4FDFF] mb-4">
                    Secure Identity Verification
                  </h2>
                  <p className="text-[#F4FDFF]/50 mb-6">
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
                      className="flex items-start gap-3 p-4 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10 hover:border-[#F4FDFF]/20 transition-all"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#1C448E]/20 to-[#938BA1]/20 rounded-lg flex items-center justify-center">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#F4FDFF]">{benefit.title}</h3>
                        <p className="text-xs text-[#F4FDFF]/40">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Security Info */}
                <div className="bg-gradient-to-r from-[#1C448E]/20 to-[#938BA1]/20 border border-[#F4FDFF]/10 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-[#938BA1] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#F4FDFF] mb-1">Your Data is Secure</h4>
                      <p className="text-xs text-[#F4FDFF]/40">
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
                      className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold px-8 hover:shadow-lg hover:shadow-[#938BA1]/20"
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
                      className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10"
                    >
                      Verify Later
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* PERSONAL INFORMATION STEP */}
          {currentStep === 'personal_info' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#F4FDFF] mb-2">
                    Personal Information
                  </h2>
                  <p className="text-[#F4FDFF]/40 text-sm">
                    Please provide your personal details. This information must match your identity documents.
                  </p>
                </div>

                <form onSubmit={handleSubmitPersonalInfo(submitPersonalInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...registerPersonalInfo('fullName')}
                        className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                        placeholder="John Doe"
                      />
                      {personalInfoErrors.fullName && (
                        <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          {...registerPersonalInfo('dateOfBirth')}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                        />
                        {personalInfoErrors.dateOfBirth && (
                          <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.dateOfBirth.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                          Nationality *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('nationality')}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                          placeholder="e.g., American"
                        />
                        {personalInfoErrors.nationality && (
                          <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.nationality.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        {...registerPersonalInfo('address')}
                        className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                        placeholder="Street address"
                      />
                      {personalInfoErrors.address && (
                        <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('city')}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                          placeholder="New York"
                        />
                        {personalInfoErrors.city && (
                          <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('postalCode')}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                          placeholder="10001"
                        />
                        {personalInfoErrors.postalCode && (
                          <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.postalCode.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#F4FDFF]/70 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          {...registerPersonalInfo('country')}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/20 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all outline-none"
                          placeholder="United States"
                        />
                        {personalInfoErrors.country && (
                          <p className="text-[#938BA1] text-xs mt-1">{personalInfoErrors.country.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={() => setCurrentStep('welcome')} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                      Back
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DOCUMENT SELECT STEP */}
          {currentStep === 'document_select' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#F4FDFF] mb-2">
                    Select Document Type
                  </h2>
                  <p className="text-[#F4FDFF]/40 text-sm">
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
                            ? 'border-[#F4FDFF] bg-[#F4FDFF]/10'
                            : 'border-[#F4FDFF]/15 hover:border-[#F4FDFF]/30'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          value={docType.id}
                          {...registerDocument('identityType')}
                          className="mt-1 w-4 h-4 text-[#938BA1] focus:ring-[#F4FDFF]/20"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{docType.icon}</span>
                            <div>
                              <h3 className="font-bold text-[#F4FDFF]">{docType.name}</h3>
                              <p className="text-sm text-[#F4FDFF]/40">{docType.description}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 ml-9">
                            <p className="text-xs font-medium text-[#F4FDFF]/50 mb-2">Requirements:</p>
                            <ul className="text-xs text-[#F4FDFF]/30 space-y-1">
                              {docType.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 text-[#938BA1] mr-2" />
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
                    <div className="mb-6 p-3 bg-[#938BA1]/10 border border-[#938BA1]/20 rounded-xl">
                      <p className="text-sm text-[#938BA1]">{documentErrors.identityType.message}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep('personal_info')} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                      Back
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20">
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
                <Button variant="outline" onClick={() => setCurrentStep('document_select')} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* SELFIE UPLOAD STEP */}
          {currentStep === 'selfie_upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#1C448E]/20 to-[#938BA1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-12 w-12 text-[#F4FDFF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F4FDFF] mb-2">
                    Take a Selfie
                  </h2>
                  <p className="text-[#F4FDFF]/50 text-sm">
                    Please take a clear selfie while holding your document next to your face.
                  </p>
                </div>

                <div className="bg-[#938BA1]/10 border border-[#938BA1]/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#938BA1] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#F4FDFF] mb-2">Important Guidelines</h4>
                      <ul className="text-sm text-[#F4FDFF]/50 space-y-1">
                        <li>• Hold your document next to your face</li>
                        <li>• Make sure your face and the document are clearly visible</li>
                        <li>• Good lighting is essential</li>
                        <li>• No filters or editing</li>
                        <li>• Document must not be expired</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-[#F4FDFF]/20 rounded-xl p-8 text-center mb-6">
                  <div className="w-16 h-16 bg-[#F4FDFF]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-[#F4FDFF]/30" />
                  </div>
                  <p className="text-[#F4FDFF]/50 mb-2">
                    Drag and drop your selfie here, or click to select
                  </p>
                  <p className="text-sm text-[#F4FDFF]/30 mb-4">
                    JPEG, PNG up to 5MB
                  </p>
                  <Button
                    onClick={() => {
                      const file = new File([''], 'selfie.jpg', { type: 'image/jpeg' })
                      handleDocumentUpload([file], 'selfie')
                    }}
                    variant="outline"
                    isLoading={isLoading}
                    className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Selfie or Upload
                  </Button>
                </div>

                {uploadedDocuments.filter(d => d.type === 'selfie').length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-[#F4FDFF] mb-3">Uploaded Selfie</h3>
                    <div className="flex flex-wrap gap-4">
                      {uploadedDocuments
                        .filter(d => d.type === 'selfie')
                        .map(doc => (
                          <div key={doc.id} className="relative">
                            <img
                              src={doc.preview}
                              alt="Selfie preview"
                              className="w-32 h-32 object-cover rounded-xl border-2 border-[#F4FDFF]/20"
                            />
                            {doc.verified && (
                              <div className="absolute top-2 right-2 bg-[#938BA1] rounded-full p-1">
                                <CheckCircle className="h-4 w-4 text-[#1C448E]" />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('document_upload')} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10">
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
                    className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20"
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
                  className="w-full border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10"
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
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-r from-[#938BA1]/20 to-[#F4FDFF]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-12 w-12 text-[#938BA1]" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-[#F4FDFF] mb-2">
                  Identity Verified!
                </h2>
                <p className="text-[#F4FDFF]/50 mb-6">
                  Your identity has been successfully verified. You now have access to all features.
                </p>

                <div className="bg-[#F4FDFF]/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5 text-[#938BA1]" />
                    <span className="text-[#F4FDFF] font-medium">
                      Verification Score: {verificationStatus.score}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/report/lost')}
                    variant="outline"
                    className="w-full border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10"
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
              <div className="bg-[#F4FDFF]/5 backdrop-blur-2xl rounded-3xl p-8 border border-[#F4FDFF]/10 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#938BA1]/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-12 w-12 text-[#938BA1]" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#F4FDFF] mb-2">
                  Verification Failed
                </h2>
                <p className="text-[#F4FDFF]/50 mb-4">
                  {verificationStatus.message || 'We could not verify your identity.'}
                </p>

                <div className="bg-[#938BA1]/10 border border-[#938BA1]/20 rounded-xl p-4 mb-6 text-left">
                  <h4 className="font-medium text-[#938BA1] mb-2">Possible reasons:</h4>
                  <ul className="text-sm text-[#F4FDFF]/50 space-y-1">
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
                    className="w-full bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] hover:shadow-lg hover:shadow-[#938BA1]/20"
                  >
                    Try Again
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate('/support')}
                    variant="outline"
                    className="w-full border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10"
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
              className="text-[#F4FDFF]/30 hover:text-[#F4FDFF]/50"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Need Help?
            </Button>
            <p className="text-xs text-[#F4FDFF]/20 mt-2">
              Our verification process is secure and confidential. Read our{' '}
              <a href="/privacy" className="text-[#938BA1] hover:text-[#F4FDFF] transition-colors">
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