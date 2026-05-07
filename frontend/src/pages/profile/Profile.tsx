import React, { useState, useEffect, useRef } from 'react'
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock, 
  LogOut, 
  Camera,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Smartphone,
  Activity,
  FileText,
  Key,
  Crown,
  Diamond,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Award
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles as ThreeSparkles, TorusKnot } from '@react-three/drei'
import { toast } from 'react-hot-toast'

import Button from '../../components/common/UI/Button'
import Input from '../../components/common/UI/Input'
import Select from '../../components/common/UI/Select'
import Modal from '../../components/common/UI/Modal'
import Card from '../../components/common/UI/Card'
import Loader from '../../components/common/UI/Loader'
import { useAuth } from '../../contexts/AuthContext'
import authApi from '../../api/auth.api'
import type { VerificationRequest, SecurityEvent, RevokeSessionRequest } from '../../types/auth.types'

// ========== 3D BACKGROUND FOR PROFILE PAGE ==========
const Profile3DBackground: React.FC = () => {
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

// Validation Schemas
const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
  location: yup.string(),
  language: yup.string(),
  timezone: yup.string(),
})

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/\d/, 'Must contain number')
    .matches(/[!@#$%^&*]/, 'Must contain special character'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

const notificationSchema = yup.object({
  emailNotifications: yup.boolean().default(true),
  pushNotifications: yup.boolean().default(true),
  smsNotifications: yup.boolean().default(false),
  itemMatches: yup.boolean().default(true),
  verificationUpdates: yup.boolean().default(true),
  claimUpdates: yup.boolean().default(true),
  messages: yup.boolean().default(true),
  systemAnnouncements: yup.boolean().default(true),
  marketing: yup.boolean().default(false),
  securityAlerts: yup.boolean().default(true),
})

type ProfileFormData = {
  fullName: string;
  email: string;
  phone: string;
  bio?: string;
  location?: string;
  language?: string;
  timezone?: string;
}

type PasswordFormData = yup.InferType<typeof passwordSchema>
type NotificationFormData = yup.InferType<typeof notificationSchema>

// Tab Navigation Component
const TabNavigation: React.FC<{
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-white/20">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileHover={{ y: -2 }}
            className={`
              inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300
              ${activeTab === tab.id
                ? 'border-[#E5E4E2] text-[#E5E4E2]'
                : 'border-transparent text-white/50 hover:text-white/70 hover:border-white/20'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </nav>
    </div>
  )
}

// File Upload Component
const FileUpload: React.FC<{
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  isLoading?: boolean;
  children: React.ReactNode;
}> = ({ onFileSelect, accept = 'image/*', maxSize = 5 * 1024 * 1024, isLoading, children }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={isLoading}
      />
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
};

// Verification Badge Component
const VerificationBadge: React.FC<{
  level: string;
  verified: boolean;
}> = ({ level, verified }) => {
  const getBadgeColor = () => {
    if (!verified) return 'from-gray-500 to-gray-600';
    if (level === 'basic') return 'from-blue-500 to-cyan-500';
    if (level === 'advanced') return 'from-green-500 to-emerald-500';
    return 'from-purple-500 to-pink-500';
  };

  const getBadgeText = () => {
    if (!verified) return 'Not Verified';
    if (level === 'basic') return 'Basic Verification';
    if (level === 'advanced') return 'Advanced Verification';
    return 'Full Verification';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getBadgeColor()} text-white`}>
      {verified ? (
        <CheckCircle size={12} className="mr-1" />
      ) : (
        <AlertCircle size={12} className="mr-1" />
      )}
      {getBadgeText()}
    </span>
  );
};

// Animated Stat Card Component
const AnimatedStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}> = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${color} rounded-xl p-4 text-white`}
  >
    <div className="flex items-center justify-between mb-2">
      {icon}
      <TrendingUp size={16} className="opacity-60" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs opacity-80">{label}</div>
  </motion.div>
);

const Profile: React.FC = () => {
  const { user, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [userSessions, setUserSessions] = useState<any[]>([])
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [activeSession, setActiveSession] = useState<any>(null)

  const profileForm = useForm<ProfileFormData>({
    // Fix: Cast the resolver to any to bypass type mismatch
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: (user as any)?.bio || '',
      location: (user as any)?.location || '',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    // Fix: Cast the resolver to any to bypass type mismatch
    resolver: yupResolver(passwordSchema) as any,
  })

  const notificationForm = useForm<NotificationFormData>({
    // Fix: Cast the resolver to any to bypass type mismatch
    resolver: yupResolver(notificationSchema) as any,
    defaultValues: (user as any)?.notificationSettings || {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      itemMatches: true,
      verificationUpdates: true,
      claimUpdates: true,
      messages: true,
      systemAnnouncements: true,
      marketing: false,
      securityAlerts: true,
    }
  })

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const sessions = await authApi.getActiveSessions()
      setUserSessions(sessions)
      const currentSession = sessions.find((session: any) => session.current)
      setActiveSession(currentSession)
      const events = await authApi.getSecurityEvents(10)
      setSecurityEvents(events)
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      console.log('Updating profile with:', data)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      setIsLoading(true)
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })
      toast.success('Password changed successfully!')
      setShowPasswordModal(false)
      passwordForm.reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async (data: NotificationFormData) => {
    try {
      setIsLoading(true)
      console.log('Updating notifications with:', data)
      toast.success('Notification settings updated!')
    } catch (error: any) {
      toast.error('Failed to update notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploading(true)
      console.log('Uploading avatar:', file)
      toast.success('Profile picture updated!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authApi.revokeSession({ sessionId })
      const sessions = await authApi.getActiveSessions()
      setUserSessions(sessions)
      toast.success('Session revoked successfully')
    } catch (error: any) {
      toast.error('Failed to revoke session')
    }
  }

  const handleRevokeAllSessions = async () => {
    try {
      const revokeRequest: RevokeSessionRequest = { 
        sessionId: 'all',
        revokeAll: true 
      }
      await authApi.revokeSession(revokeRequest)
      await logout()
      toast.success('All other sessions revoked')
    } catch (error: any) {
      toast.error('Failed to revoke sessions')
    }
  }

  const handleDeleteAccount = async () => {
    toast.error('Account deletion requires password confirmation')
    setShowDeleteModal(false)
  }

  const handleStartVerification = async () => {
    try {
      setIsLoading(true)
      const mockVerification: VerificationRequest = {
        id: Date.now().toString(),
        userId: user?.id || '',
        status: 'pending',
        type: 'identity',
        submittedAt: new Date(),
        documents: [],
        method: 'manual',
        score: 0
      }
      setVerificationRequests([...verificationRequests, mockVerification])
      toast.success('Verification process started!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to start verification')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    { icon: <Award size={20} />, label: 'Verification Score', value: '98%', color: 'from-purple-500 to-pink-500', delay: 0.1 },
    { icon: <Shield size={20} />, label: 'Trust Rating', value: '95%', color: 'from-blue-500 to-cyan-500', delay: 0.2 },
    { icon: <TrendingUp size={20} />, label: 'Items Returned', value: '12', color: 'from-green-500 to-emerald-500', delay: 0.3 },
    { icon: <Award size={20} />, label: 'Community Rank', value: 'Top 5%', color: 'from-orange-500 to-red-500', delay: 0.4 },
  ]

  if (isLoading && !user) {
    return <Loader fullScreen />
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#4b0082] via-[#6d28d9] to-[#4b0082] overflow-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#E5E4E2" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
          <Profile3DBackground />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] rounded-2xl shadow-xl mb-4"
          >
            <User className="w-8 h-8 text-[#4b0082]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-white/60 mt-2">
            Manage your account settings, security, and preferences
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedStatCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <TabNavigation
          tabs={[
            { id: 'profile', label: 'Profile', icon: <User size={18} /> },
            { id: 'security', label: 'Security', icon: <Shield size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-white" />
                        )}
                      </div>
                      
                      <FileUpload
                        onFileSelect={handleAvatarUpload}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024}
                        isLoading={isUploading}
                      >
                        <button className="absolute bottom-0 right-0 bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082] p-2 rounded-full transition-all duration-300 hover:scale-110">
                          <Camera size={16} />
                        </button>
                      </FileUpload>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                      <p className="text-white/50">{user?.email}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <VerificationBadge 
                          level={user?.verificationLevel || 'basic'}
                          verified={user?.identityVerified || false}
                        />
                        
                        {user?.role === 'admin' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white">
                            <Shield size={12} className="mr-1" />
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                    
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setIsEditing(false)
                            profileForm.reset()
                          }}
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() => profileForm.handleSubmit(handleProfileUpdate)()}
                          isLoading={isLoading}
                          className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                        >
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Full Name"
                          type="text"
                          {...profileForm.register('fullName')}
                          error={profileForm.formState.errors.fullName?.message}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 bg-transparent text-white placeholder-white/30"
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Email Address"
                          type="email"
                          {...profileForm.register('email')}
                          error={profileForm.formState.errors.email?.message}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder-white/30"
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Phone Number"
                          type="tel"
                          {...profileForm.register('phone')}
                          error={profileForm.formState.errors.phone?.message}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder-white/30"
                        />
                      </div>
                      
                      <div>
                        <Input
                          label="Location"
                          type="text"
                          {...profileForm.register('location')}
                          error={profileForm.formState.errors.location?.message}
                          disabled={!isEditing}
                          className="bg-white/5 border-white/20 text-white placeholder-white/30"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Bio
                        </label>
                        <textarea
                          {...profileForm.register('bio')}
                          rows={3}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#E5E4E2] focus:ring-2 focus:ring-[#E5E4E2]/20 transition-all outline-none disabled:opacity-50"
                          placeholder="Tell us about yourself..."
                          disabled={!isEditing}
                        />
                        {profileForm.formState.errors.bio && (
                          <p className="text-sm text-red-400 mt-1">
                            {profileForm.formState.errors.bio.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Account Security Section */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Lock className="text-[#E5E4E2] mr-3" size={20} />
                        <div>
                          <h4 className="font-medium text-white">Password</h4>
                          <p className="text-sm text-white/40">Last changed 2 weeks ago</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordModal(true)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Fingerprint className="text-[#E5E4E2] mr-3" size={20} />
                        <div>
                          <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                          <p className="text-sm text-white/40">
                            {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={user?.twoFactorEnabled ? 'secondary' : 'primary'}
                        className={user?.twoFactorEnabled ? 'border-white/20 text-white hover:bg-white/10' : 'bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]'}
                      >
                        {user?.twoFactorEnabled ? 'Manage' : 'Enable'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Activity className="text-[#E5E4E2] mr-3" size={20} />
                        <div>
                          <h4 className="font-medium text-white">Active Sessions</h4>
                          <p className="text-sm text-white/40">
                            {userSessions.length} active session{userSessions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowSessionsModal(true)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        View All
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Verification Status */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Identity Verification</h3>
                    <Button
                      onClick={handleStartVerification}
                      disabled={user?.identityVerified || verificationRequests.some(v => v.status === 'pending')}
                      className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                    >
                      {user?.identityVerified ? 'Verified' : 'Verify Identity'}
                    </Button>
                  </div>

                  {user?.identityVerified ? (
                    <div className="flex items-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <CheckCircle className="text-green-400 mr-3" size={24} />
                      <div>
                        <h4 className="font-medium text-green-400">Identity Verified</h4>
                        <p className="text-sm text-green-300/70">
                          Your identity has been successfully verified. You have full access to all features.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <div className="flex items-start">
                          <AlertCircle className="text-yellow-400 mr-3 mt-0.5" size={20} />
                          <div>
                            <h4 className="font-medium text-yellow-400">Verification Required</h4>
                            <p className="text-sm text-yellow-300/70">
                              To report and claim items, you need to verify your identity.
                              This helps prevent fraud and ensures items are returned to rightful owners.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl text-center border border-white/10">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="text-blue-400" size={24} />
                          </div>
                          <h4 className="font-medium text-white mb-1">Upload Documents</h4>
                          <p className="text-xs text-white/40">Provide government-issued ID</p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl text-center border border-white/10">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Camera className="text-green-400" size={24} />
                          </div>
                          <h4 className="font-medium text-white mb-1">Take Selfie</h4>
                          <p className="text-xs text-white/40">Verify it's really you</p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl text-center border border-white/10">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="text-purple-400" size={24} />
                          </div>
                          <h4 className="font-medium text-white mb-1">Get Verified</h4>
                          <p className="text-xs text-white/40">Process takes 24-48 hours</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Events */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Security Activity</h3>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {securityEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            event.type === 'login' 
                              ? 'bg-blue-500/20 text-blue-400'
                              : event.type === 'logout'
                              ? 'bg-gray-500/20 text-gray-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {event.type === 'login' ? (
                              <Key size={16} />
                            ) : event.type === 'logout' ? (
                              <LogOut size={16} />
                            ) : (
                              <AlertCircle size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{event.action}</p>
                            <p className="text-xs text-white/40">
                              {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/40">{event.ipAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                  
                  <form onSubmit={notificationForm.handleSubmit(handleNotificationUpdate)} className="space-y-6">
                    <div>
                      <h4 className="font-medium text-white mb-4">Notification Channels</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive notifications via email' },
                          { name: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Receive push notifications' },
                          { name: 'smsNotifications', icon: Smartphone, label: 'SMS Notifications', desc: 'Receive SMS notifications' },
                        ].map((channel) => (
                          <div key={channel.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center">
                              <channel.icon className="text-[#E5E4E2] mr-3" size={20} />
                              <div>
                                <p className="font-medium text-white">{channel.label}</p>
                                <p className="text-xs text-white/40">{channel.desc}</p>
                              </div>
                            </div>
                            <Controller
                              name={channel.name as keyof NotificationFormData}
                              control={notificationForm.control}
                              render={({ field }) => (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={field.value as boolean}
                                    onChange={field.onChange}
                                  />
                                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5E4E2]"></div>
                                </label>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-4">Notification Types</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { name: 'itemMatches', label: 'Item Matches', desc: 'When items match your lost/found reports' },
                          { name: 'verificationUpdates', label: 'Verification Updates', desc: 'When verification status changes' },
                          { name: 'claimUpdates', label: 'Claim Updates', desc: 'When claim status changes' },
                          { name: 'messages', label: 'Messages', desc: 'When you receive new messages' },
                        ].map((type) => (
                          <div key={type.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div>
                              <p className="font-medium text-white">{type.label}</p>
                              <p className="text-xs text-white/40">{type.desc}</p>
                            </div>
                            <Controller
                              name={type.name as keyof NotificationFormData}
                              control={notificationForm.control}
                              render={({ field }) => (
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 rounded border-white/30 bg-white/5 text-[#E5E4E2] focus:ring-[#E5E4E2]"
                                  checked={field.value as boolean}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]"
                      >
                        Save Notification Settings
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-white mb-4">Appearance</h4>
                      <div className="flex space-x-4">
                        {[
                          { icon: Sun, label: 'Light', value: 'light' },
                          { icon: Moon, label: 'Dark', value: 'dark' },
                          { icon: Globe, label: 'System', value: 'system' },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            className="flex flex-col items-center p-4 border-2 rounded-xl transition-all hover:scale-105 bg-white/5 border-white/20 hover:border-[#E5E4E2]"
                          >
                            <theme.icon className="text-[#E5E4E2] mb-2" size={24} />
                            <span className="text-white text-sm">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-4">Language & Region</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          label="Language"
                          options={[
                            { value: 'en', label: 'English' },
                            { value: 'es', label: 'Spanish' },
                            { value: 'fr', label: 'French' },
                            { value: 'de', label: 'German' },
                          ]}
                          value={profileForm.watch('language')}
                          onChange={(value) => profileForm.setValue('language', value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                        
                        <Select
                          label="Timezone"
                          options={[
                            { value: 'UTC', label: 'UTC' },
                            { value: 'EST', label: 'Eastern Time' },
                            { value: 'PST', label: 'Pacific Time' },
                            { value: 'GMT', label: 'GMT' },
                          ]}
                          value={profileForm.watch('timezone')}
                          onChange={(value) => profileForm.setValue('timezone', value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-4">Privacy</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div>
                            <p className="font-medium text-white">Profile Visibility</p>
                            <p className="text-xs text-white/40">Who can see your profile</p>
                          </div>
                          <Select
                            options={[
                              { value: 'public', label: 'Public' },
                              { value: 'contacts', label: 'Contacts Only' },
                              { value: 'private', label: 'Private' },
                            ]}
                            value="contacts"
                            onChange={() => {}}
                            className="w-40 bg-white/5 border-white/20 text-white"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div>
                            <p className="font-medium text-white">Show Contact Info</p>
                            <p className="text-xs text-white/40">Display email and phone to others</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5E4E2]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-300">Delete Account</h4>
                <p className="text-sm text-red-300/70">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-300">Logout</h4>
                <p className="text-sm text-red-300/70">
                  Sign out from this device
                </p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password" size="md">
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPassword.current ? 'text' : 'password'}
              {...passwordForm.register('currentPassword')}
              error={passwordForm.formState.errors.currentPassword?.message}
              className="bg-white/5 border-white/20 text-white placeholder-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-8 text-white/40 hover:text-white/60"
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword.new ? 'text' : 'password'}
              {...passwordForm.register('newPassword')}
              error={passwordForm.formState.errors.newPassword?.message}
              className="bg-white/5 border-white/20 text-white placeholder-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-8 text-white/40 hover:text-white/60"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPassword.confirm ? 'text' : 'password'}
              {...passwordForm.register('confirmPassword')}
              error={passwordForm.formState.errors.confirmPassword?.message}
              className="bg-white/5 border-white/20 text-white placeholder-white/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-8 text-white/40 hover:text-white/60"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="bg-gradient-to-r from-[#E5E4E2] to-[#c4b5fd] text-[#4b0082]">
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSessionsModal} onClose={() => setShowSessionsModal(false)} title="Active Sessions" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center">
              <Smartphone className="text-blue-400 mr-3" size={20} />
              <div>
                <h4 className="font-medium text-blue-400">Current Session</h4>
                <p className="text-xs text-blue-300/70">
                  {activeSession?.device?.browser} on {activeSession?.device?.os}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">All Sessions</h4>
            {userSessions.map((session) => (
              <div key={session.id} className={`flex items-center justify-between p-3 rounded-xl border ${session.current ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-center">
                  <div className="p-2 bg-white/10 rounded-lg mr-3">
                    {session.device?.type === 'mobile' ? <Smartphone size={20} className="text-white/60" /> : <CreditCard size={20} className="text-white/60" />}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      {session.device?.browser} on {session.device?.os}
                      {session.current && <span className="ml-2 text-xs text-blue-400">(Current)</span>}
                    </p>
                    <p className="text-xs text-white/40">
                      Last active: {format(new Date(session.lastActive), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
                
                {!session.current && (
                  <Button variant="danger" size="sm" onClick={() => handleRevokeSession(session.id)}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Button variant="danger" fullWidth onClick={handleRevokeAllSessions}>
              Revoke All Other Sessions
            </Button>
            <p className="text-xs text-white/30 text-center mt-2">
              This will log you out from all other devices except this one.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" size="md">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-start">
              <AlertCircle className="text-red-400 mr-3 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-red-400">Warning: This action cannot be undone</h4>
                <p className="text-sm text-red-300/70 mt-1">
                  Deleting your account will permanently remove all your data.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Enter your password to confirm"
            type="password"
            placeholder="Current password"
            className="bg-white/5 border-white/20 text-white placeholder-white/30"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Profile