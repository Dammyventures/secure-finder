import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-hot-toast'
import { 
  Save, 
  Bell, 
  Shield, 
  User, 
  Lock, 
  Moon, 
  Sun, 
  Palette,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  QrCode,
  Download,
  Trash2,
  Check,
  AlertCircle,
  Key,
  ShieldCheck,
  SmartphoneIcon as Device,
  Clock,
  MailCheck,
  Phone,
  MapPin,
  Globe as LanguageIcon,
  DollarSign,
  Ruler,
  Calendar,
  VolumeX,
  Upload as UploadIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { authApi } from '../../api/auth.api'
import Button from '../../components/common/UI/Button'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Card from '../../components/common/UI/Card'
import Select from '../../components/common/UI/Select'
import Loader from '../../components/common/UI/Loader'
import { storage } from '../../utils/storage'

// Type definitions
interface UserSettings {
  fullName: string
  email: string
  phone: string
  bio: string
  language: string
  timezone: string
  dateFormat: string
  currency: string
  measurementSystem: 'metric' | 'imperial'
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  profileVisibility: 'public' | 'contacts' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowMessaging: boolean
  twoFactorEnabled: boolean
  twoFactorMethod: 'email' | 'sms' | 'authenticator'
  loginAlerts: boolean
  suspiciousActivityAlerts: boolean
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

// Validation schemas
const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Too short').max(100, 'Too long'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  bio: yup.string().max(500, 'Bio too long')
})

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/\d/, 'Must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain special character'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

// Switch Component - Dark themed
const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F4FDFF] focus:ring-offset-2 focus:ring-offset-[#1C448E] ${
        checked ? 'bg-gradient-to-r from-[#F4FDFF] to-[#938BA1]' : 'bg-[#938BA1]/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-blue shadow-lg transition-all duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// QR Code Generator Placeholder
const QrCodeGenerator: React.FC<{
  value: string;
  size: number;
  className?: string;
}> = ({ value, size, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="text-center">
        <div className="text-sm text-[#938BA1] mb-2">QR Code Placeholder</div>
        <div className="text-xs text-[#938BA1]/60">Value: {value.substring(0, 30)}...</div>
      </div>
    </div>
  )
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showThemePreview, setShowThemePreview] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [securityEvents, setSecurityEvents] = useState<any[]>([])
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')
  
  // Form hooks
  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: ''
    }
  })

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Initialize settings from storage or defaults
  const [settings, setSettings] = useState<UserSettings>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    measurementSystem: 'metric',
    theme: 'auto',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    profileVisibility: 'contacts',
    showEmail: false,
    showPhone: false,
    showLocation: false,
    allowMessaging: true,
    twoFactorEnabled: user?.twoFactorEnabled || false,
    twoFactorMethod: 'authenticator',
    loginAlerts: true,
    suspiciousActivityAlerts: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  })

  // Load user data on mount
  useEffect(() => {
    loadUserData()
    loadSessions()
    loadSecurityEvents()
    
    const savedSettings = storage.getSettings<UserSettings>()
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...savedSettings }))
    }
  }, [])

  // Update form when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bio: ''
      })
    }
  }, [user])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      await authApi.getCurrentUser()
    } catch (error) {
      toast.error('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSessions = async () => {
    try {
      const sessionsData = await authApi.getActiveSessions()
      setSessions(sessionsData)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const loadSecurityEvents = async () => {
    try {
      const events = await authApi.getSecurityEvents()
      setSecurityEvents(events)
    } catch (error) {
      console.error('Failed to load security events:', error)
    }
  }

  const handleProfileUpdate = async (data: any) => {
    try {
      setIsLoading(true)
      await authApi.updateProfile(data)
      toast.success('Profile updated successfully')
      storage.setSettings(settings)
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (data: any) => {
    try {
      setIsLoading(true)
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })
      toast.success('Password changed successfully')
      setShowPasswordModal(false)
      passwordForm.reset()
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorSetup = async () => {
    try {
      setIsLoading(true)
      const setupData = await authApi.setupTwoFactor('authenticator')
      setTwoFactorSecret(setupData.secret || '')
      setBackupCodes(setupData.backupCodes || [])
      toast.success('Two-factor setup initiated')
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to setup 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorVerify = async () => {
    try {
      setIsLoading(true)
      const result = await authApi.verifyTwoFactorSetup({
        method: 'authenticator',
        code: twoFactorCode
      })
      
      if (result.success) {
        toast.success('Two-factor authentication enabled')
        setSettings(prev => ({ ...prev, twoFactorEnabled: true }))
        setShowQrCode(false)
        setTwoFactorCode('')
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorDisable = async () => {
    try {
      setIsLoading(true)
      await authApi.disableTwoFactor()
      toast.success('Two-factor authentication disabled')
      setSettings(prev => ({ ...prev, twoFactorEnabled: false }))
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to disable 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountDelete = async () => {
    try {
      setIsLoading(true)
      await authApi.deleteAccount('confirm-delete')
      toast.success('Account deleted successfully')
      logout()
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to delete account')
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authApi.revokeSession({ sessionId })
      toast.success('Session revoked')
      loadSessions()
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to revoke session')
    }
  }

  const handleRevokeAllSessions = async () => {
    try {
      await authApi.revokeSession({ sessionId: 'all', revokeAll: true })
      toast.success('All other sessions revoked')
      loadSessions()
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to revoke sessions')
    }
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setSettings(prev => ({ ...prev, theme }))
    
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light')
    }
    
    storage.setSettings(settings)
  }

  const handleThemePreview = (theme: 'light' | 'dark') => {
    setPreviewTheme(theme)
    setShowThemePreview(true)
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `secure-finder-settings-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Settings exported successfully')
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(prev => ({ ...prev, ...importedSettings }))
        storage.setSettings(importedSettings)
        toast.success('Settings imported successfully')
      } catch (error) {
        toast.error('Invalid settings file')
      }
    }
    reader.readAsText(file)
  }

  const handleDownloadBackupCodes = () => {
    if (!backupCodes.length) return
    
    const codesText = backupCodes.join('\n')
    const blob = new Blob([codesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'secure-finder-backup-codes.txt'
    link.click()
    
    URL.revokeObjectURL(url)
    toast.success('Backup codes downloaded')
  }

  if (isLoading && !sessions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
        <Loader size="lg" />
      </div>
    )
  }

  // Helper function to handle select changes
  const handleSelectChange = (key: keyof UserSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with glass morphism effect */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-6 rounded-2xl bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-[#F4FDFF]/60">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="sticky top-8 bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                <nav className="space-y-1">
                  {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'preferences', label: 'Preferences', icon: Palette },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'privacy', label: 'Privacy', icon: Shield },
                    { id: 'security', label: 'Security', icon: Lock },
                    { id: 'sessions', label: 'Sessions', icon: Device },
                    { id: 'export', label: 'Import/Export', icon: Download },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] shadow-lg'
                          : 'text-[#F4FDFF]/70 hover:text-[#F4FDFF] hover:bg-[#F4FDFF]/10'
                      }`}
                    >
                      <tab.icon className="mr-3" size={20} />
                      {tab.label}
                    </motion.button>
                  ))}

                  <div className="pt-4 mt-4 border-t border-[#F4FDFF]/10">
                    <motion.button
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="mr-3" size={20} />
                      Delete Account
                    </motion.button>
                  </div>
                </nav>
              </Card>
            </motion.div>
          </div>

          {/* Main settings area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <Card className="bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Profile Information
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Update your personal information and profile details
                      </p>
                    </div>

                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            {...profileForm.register('fullName')}
                            className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                            placeholder="John Doe"
                          />
                          {profileForm.formState.errors.fullName?.message && (
                            <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.fullName?.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            {...profileForm.register('email')}
                            className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                            placeholder="you@example.com"
                          />
                          {profileForm.formState.errors.email?.message && (
                            <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.email?.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            {...profileForm.register('phone')}
                            className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                            placeholder="+1 (234) 567-8900"
                          />
                          {profileForm.formState.errors.phone?.message && (
                            <p className="text-red-400 text-xs mt-1">{profileForm.formState.errors.phone?.message}</p>
                          )}
                        </div>

                        <div>
                          <Select
                            label="Language"
                            value={settings.language}
                            onChange={(value: string) => handleSelectChange('language', value)}
                            options={[
                              { value: 'en', label: 'English' },
                              { value: 'es', label: 'Spanish' },
                              { value: 'fr', label: 'French' },
                              { value: 'de', label: 'German' },
                              { value: 'zh', label: 'Chinese' },
                              { value: 'ja', label: 'Japanese' },
                            ]}
                            className="bg-[#F4FDFF]/5 border-[#F4FDFF]/20 text-[#F4FDFF]"
                          />
                        </div>

                        <div>
                          <Select
                            label="Timezone"
                            value={settings.timezone}
                            onChange={(value: string) => handleSelectChange('timezone', value)}
                            options={[
                              { value: 'UTC', label: 'UTC' },
                              { value: 'America/New_York', label: 'Eastern Time' },
                              { value: 'America/Chicago', label: 'Central Time' },
                              { value: 'America/Denver', label: 'Mountain Time' },
                              { value: 'America/Los_Angeles', label: 'Pacific Time' },
                              { value: 'Europe/London', label: 'London' },
                              { value: 'Europe/Paris', label: 'Paris' },
                              { value: 'Asia/Tokyo', label: 'Tokyo' },
                            ]}
                            className="bg-[#F4FDFF]/5 border-[#F4FDFF]/20 text-[#F4FDFF]"
                          />
                        </div>

                        <div>
                          <Select
                            label="Currency"
                            value={settings.currency}
                            onChange={(value: string) => handleSelectChange('currency', value)}
                            options={[
                              { value: 'USD', label: 'USD - US Dollar' },
                              { value: 'EUR', label: 'EUR - Euro' },
                              { value: 'GBP', label: 'GBP - British Pound' },
                              { value: 'JPY', label: 'JPY - Japanese Yen' },
                              { value: 'CAD', label: 'CAD - Canadian Dollar' },
                              { value: 'AUD', label: 'AUD - Australian Dollar' },
                            ]}
                            className="bg-[#F4FDFF]/5 border-[#F4FDFF]/20 text-[#F4FDFF]"
                          />
                        </div>

                        <div>
                          <Select
                            label="Date Format"
                            value={settings.dateFormat}
                            onChange={(value: string) => handleSelectChange('dateFormat', value)}
                            options={[
                              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            ]}
                            className="bg-[#F4FDFF]/5 border-[#F4FDFF]/20 text-[#F4FDFF]"
                          />
                        </div>

                        <div>
                          <Select
                            label="Measurement System"
                            value={settings.measurementSystem}
                            onChange={(value: string) => handleSelectChange('measurementSystem', value as 'metric' | 'imperial')}
                            options={[
                              { value: 'metric', label: 'Metric (km, kg)' },
                              { value: 'imperial', label: 'Imperial (miles, lbs)' },
                            ]}
                            className="bg-[#F4FDFF]/5 border-[#F4FDFF]/20 text-[#F4FDFF]"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                          Bio
                        </label>
                        <textarea
                          {...profileForm.register('bio')}
                          rows={4}
                          className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20 focus:border-[#F4FDFF] transition-all duration-300 text-[#F4FDFF] placeholder-[#F4FDFF]/30 resize-none"
                          placeholder="Tell us about yourself..."
                          maxLength={500}
                        />
                        <div className="text-right text-sm text-[#F4FDFF]/40 mt-1">
                          {profileForm.watch('bio')?.length || 0}/500
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] font-semibold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
                          >
                            {isLoading ? (
                              <>
                                <span className="animate-spin">⏳</span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={18} />
                                Save Changes
                              </>
                            )}
                          </button>
                        </motion.div>
                      </div>
                    </form>

                    {/* Password Change Section */}
                    <div className="mt-8 pt-8 border-t border-[#F4FDFF]/10">
                      <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                        Password
                      </h3>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-2.5 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300 flex items-center gap-2"
                      >
                        <Key size={18} />
                        Change Password
                      </button>
                    </div>
                  </Card>
                )}

                {/* Preferences Settings */}
                {activeTab === 'preferences' && (
                  <Card className="bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Preferences
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Customize your app experience
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Theme
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: 'light', label: 'Light', icon: Sun, color: 'text-yellow-400', bg: 'from-yellow-400/20 to-yellow-400/5' },
                            { value: 'dark', label: 'Dark', icon: Moon, color: 'text-indigo-400', bg: 'from-indigo-400/20 to-indigo-400/5' },
                            { value: 'auto', label: 'Auto', icon: Palette, color: 'text-purple-400', bg: 'from-purple-400/20 to-purple-400/5' },
                          ].map((theme) => (
                            <motion.button
                              key={theme.value}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleThemeChange(theme.value as 'light' | 'dark' | 'auto')}
                              className={`p-4 border rounded-xl text-center transition-all duration-300 ${
                                settings.theme === theme.value
                                  ? `border-[#F4FDFF] bg-gradient-to-br ${theme.bg} shadow-lg`
                                  : 'border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40 hover:bg-[#F4FDFF]/5'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-2">
                                <theme.icon className={theme.color} size={28} />
                              </div>
                              <div className="font-medium text-[#F4FDFF]">{theme.label}</div>
                              <div className="text-sm text-[#F4FDFF]/40">
                                {theme.value === 'auto' ? 'System default' : `${theme.label} theme`}
                              </div>
                              {settings.theme === theme.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-2"
                                >
                                  <Check className="text-[#938BA1] mx-auto" size={20} />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleThemePreview('light')}
                            className="px-4 py-2 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300"
                          >
                            Preview Light
                          </button>
                          <button
                            onClick={() => handleThemePreview('dark')}
                            className="px-4 py-2 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300"
                          >
                            Preview Dark
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <Card className="bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Notifications
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Control how and when you receive notifications
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Notification Channels */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Notification Channels
                        </h3>
                        <div className="space-y-4">
                          {[
                            { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                            { id: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: Bell },
                            { id: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: Smartphone },
                          ].map((item) => (
                            <motion.div 
                              key={item.id} 
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                                  <item.icon className="text-[#938BA1]" size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-[#F4FDFF]">{item.label}</div>
                                  <div className="text-sm text-[#F4FDFF]/40">{item.desc}</div>
                                </div>
                              </div>
                              <Switch
                                checked={settings[item.id as keyof UserSettings] as boolean}
                                onChange={(checked: boolean) => setSettings(prev => ({ ...prev, [item.id]: checked }))}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Quiet Hours */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Quiet Hours
                        </h3>
                        <div className="space-y-4">
                          <motion.div 
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                                <VolumeX className="text-[#938BA1]" size={20} />
                              </div>
                              <div>
                                <div className="font-medium text-[#F4FDFF]">Enable Quiet Hours</div>
                                <div className="text-sm text-[#F4FDFF]/40">Pause notifications during specified hours</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.quietHours.enabled}
                              onChange={(checked: boolean) => setSettings(prev => ({
                                ...prev,
                                quietHours: { ...prev.quietHours, enabled: checked }
                              }))}
                            />
                          </motion.div>

                          {settings.quietHours.enabled && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-2 gap-4 pl-14"
                            >
                              <div>
                                <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={settings.quietHours.startTime}
                                  onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    quietHours: { ...prev.quietHours, startTime: e.target.value }
                                  }))}
                                  className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={settings.quietHours.endTime}
                                  onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    quietHours: { ...prev.quietHours, endTime: e.target.value }
                                  }))}
                                  className="w-full px-4 py-2 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <Card className="bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Privacy
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Control your privacy and visibility settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Profile Visibility
                        </h3>
                        <div className="space-y-3">
                          {[
                            { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                            { value: 'contacts', label: 'Contacts Only', description: 'Only people you connect with can see your profile' },
                            { value: 'private', label: 'Private', description: 'Only you can see your profile' },
                          ].map((option) => (
                            <motion.label
                              key={option.value}
                              whileHover={{ x: 5 }}
                              className="flex items-center p-4 border border-[#F4FDFF]/20 rounded-xl cursor-pointer hover:bg-[#F4FDFF]/5 transition-all duration-300"
                            >
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={settings.profileVisibility === option.value}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  profileVisibility: e.target.value as any
                                }))}
                                className="mr-3 accent-[#938BA1] w-4 h-4"
                              />
                              <div>
                                <div className="font-medium text-[#F4FDFF]">{option.label}</div>
                                <div className="text-sm text-[#F4FDFF]/40">{option.description}</div>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          {[
                            { id: 'showEmail', label: 'Show Email Address', desc: 'Allow others to see your email', icon: Mail },
                            { id: 'showPhone', label: 'Show Phone Number', desc: 'Allow others to see your phone number', icon: Phone },
                            { id: 'showLocation', label: 'Show Location', desc: 'Allow others to see your approximate location', icon: MapPin },
                          ].map((item) => (
                            <motion.div 
                              key={item.id} 
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                                  <item.icon className="text-[#938BA1]" size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-[#F4FDFF]">{item.label}</div>
                                  <div className="text-sm text-[#F4FDFF]/40">{item.desc}</div>
                                </div>
                              </div>
                              <Switch
                                checked={settings[item.id as keyof UserSettings] as boolean}
                                onChange={(checked: boolean) => setSettings(prev => ({ ...prev, [item.id]: checked }))}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Messaging */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Messaging
                        </h3>
                        <motion.div 
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                              <MailCheck className="text-[#938BA1]" size={20} />
                            </div>
                            <div>
                              <div className="font-medium text-[#F4FDFF]">Allow Direct Messages</div>
                              <div className="text-sm text-[#F4FDFF]/40">Allow others to send you direct messages</div>
                            </div>
                          </div>
                          <Switch
                            checked={settings.allowMessaging}
                            onChange={(checked: boolean) => setSettings(prev => ({ ...prev, allowMessaging: checked }))}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <Card className="bg-[#F4FDFF]/5 backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Security
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Manage your account security settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="p-6 border border-[#F4FDFF]/20 rounded-xl bg-[#F4FDFF]/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                              <ShieldCheck className="text-[#938BA1]" size={24} />
                            </div>
                            <div>
                              <div className="font-medium text-[#F4FDFF]">Two-Factor Authentication</div>
                              <div className="text-sm text-[#F4FDFF]/40">
                                {settings.twoFactorEnabled 
                                  ? '✅ 2FA is enabled for your account'
                                  : 'Add an extra layer of security to your account'
                                }
                              </div>
                            </div>
                          </div>
                          {settings.twoFactorEnabled ? (
                            <button
                              onClick={handleTwoFactorDisable}
                              disabled={isLoading}
                              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300 disabled:opacity-50"
                            >
                              {isLoading ? '...' : 'Disable'}
                            </button>
                          ) : (
                            <button
                              onClick={handleTwoFactorSetup}
                              disabled={isLoading}
                              className="px-4 py-2 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl transition-all duration-300 disabled:opacity-50"
                            >
                              {isLoading ? '...' : 'Enable'}
                            </button>
                          )}
                        </div>

                        {twoFactorSecret && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-4 bg-[#F4FDFF]/5 rounded-xl"
                          >
                            <h4 className="font-medium text-[#F4FDFF] mb-2">Setup Instructions</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#F4FDFF]/60 mb-4">
                              <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                              <li>Click "Add Account" and scan the QR code below</li>
                              <li>Enter the 6-digit code generated by the app</li>
                            </ol>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="p-4 bg-blue rounded-xl">
                                {showQrCode ? (
                                  <QrCodeGenerator
                                    value={`otpauth://totp/SecureFinder:${user?.email}?secret=${twoFactorSecret}&issuer=SecureFinder`}
                                    size={160}
                                    className="p-2 rounded"
                                  />
                                ) : (
                                  <div className="w-40 h-40 flex items-center justify-center bg-[#F4FDFF]/10 rounded-xl">
                                    <button
                                      onClick={() => setShowQrCode(true)}
                                      className="px-4 py-2 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300 flex items-center gap-2"
                                    >
                                      <QrCode size={20} />
                                      Show QR
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                                    Manual Entry Code
                                  </label>
                                  <div className="p-3 bg-[#F4FDFF]/5 rounded-xl font-mono text-sm text-[#F4FDFF]">
                                    {twoFactorSecret}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                                    Verification Code
                                  </label>
                                  <input
                                    type="text"
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                                  />
                                </div>

                                <button
                                  onClick={handleTwoFactorVerify}
                                  disabled={isLoading}
                                  className="w-full px-4 py-3 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl transition-all duration-300 disabled:opacity-50"
                                >
                                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                                </button>
                              </div>
                            </div>

                            {backupCodes.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-[#F4FDFF]">Backup Codes</h4>
                                  <button
                                    onClick={handleDownloadBackupCodes}
                                    className="px-3 py-1.5 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm"
                                  >
                                    <Download size={16} />
                                    Download
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {backupCodes.map((code, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-[#F4FDFF]/5 rounded-xl text-center font-mono text-sm text-[#F4FDFF]"
                                    >
                                      {code}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-[#F4FDFF]/40 mt-2">
                                  ⚠️ Save these codes in a secure place. Each code can be used once.
                                </p>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Security Alerts */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Security Alerts
                        </h3>
                        <div className="space-y-4">
                          {[
                            { id: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new logins to your account', icon: Bell },
                            { id: 'suspiciousActivityAlerts', label: 'Suspicious Activity Alerts', desc: 'Get notified of suspicious account activity', icon: AlertCircle },
                          ].map((item) => (
                            <motion.div 
                              key={item.id} 
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                                  <item.icon className="text-[#938BA1]" size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-[#F4FDFF]">{item.label}</div>
                                  <div className="text-sm text-[#F4FDFF]/40">{item.desc}</div>
                                </div>
                              </div>
                              <Switch
                                checked={settings[item.id as keyof UserSettings] as boolean}
                                onChange={(checked: boolean) => setSettings(prev => ({ ...prev, [item.id]: checked }))}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Security Events */}
                      <div>
                        <h3 className="text-lg font-medium text-[#F4FDFF] mb-4">
                          Recent Security Events
                        </h3>
                        <div className="space-y-2">
                          {securityEvents.slice(0, 5).map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 border border-[#F4FDFF]/20 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-[#F4FDFF]">{event.action}</div>
                                  <div className="text-sm text-[#F4FDFF]/40">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-sm text-[#F4FDFF]/40">
                                  {event.ipAddress} • {event.location?.city || 'Unknown location'}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {securityEvents.length === 0 && (
                            <div className="text-center py-8 text-[#F4FDFF]/40">
                              No security events found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Active Sessions */}
                {activeTab === 'sessions' && (
                  <Card className="bg-blue backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                            Active Sessions
                          </h2>
                          <p className="text-[#F4FDFF]/60">
                            Manage your active login sessions
                          </p>
                        </div>
                        <button
                          onClick={handleRevokeAllSessions}
                          disabled={sessions.length <= 1}
                          className="px-4 py-2 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300 disabled:opacity-50"
                        >
                          Revoke All Other Sessions
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border border-[#F4FDFF]/20 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-[#1C448E]/30 rounded-xl">
                                <Device size={20} className="text-[#F4FDFF]" />
                              </div>
                              <div>
                                <div className="font-medium text-[#F4FDFF]">{session.device.type}</div>
                                <div className="text-sm text-[#F4FDFF]/40">
                                  {session.device.os} • {session.device.browser}
                                </div>
                                <div className="text-sm text-[#F4FDFF]/40 mt-1">
                                  Last active: {new Date(session.lastActive).toLocaleString()}
                                </div>
                                {session.location && (
                                  <div className="text-sm text-[#F4FDFF]/40">
                                    📍 {session.location.city}, {session.location.country}
                                  </div>
                                )}
                                {session.current && (
                                  <span className="inline-block mt-1 px-3 py-1 text-xs bg-gradient-to-r from-[#938BA1] to-[#F4FDFF] text-[#1C448E] font-semibold rounded-full">
                                    Current Session
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <div className="text-sm text-[#F4FDFF]/40">
                                IP: {session.ipAddress}
                              </div>
                              {!session.current && (
                                <button
                                  onClick={() => handleRevokeSession(session.id)}
                                  className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300 text-sm"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {sessions.length === 0 && (
                        <div className="text-center py-8 text-[#F4FDFF]/40">
                          No active sessions found
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Import/Export Settings */}
                {activeTab === 'export' && (
                  <Card className="bg-blue backdrop-blur-xl border border-[#F4FDFF]/10 shadow-xl">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                        Import & Export
                      </h2>
                      <p className="text-[#F4FDFF]/60">
                        Backup or restore your settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Export Settings */}
                      <motion.div 
                        className="p-6 border border-[#F4FDFF]/20 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                            <Download className="text-[#938BA1]" size={24} />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#F4FDFF]">Export Settings</h3>
                            <p className="text-sm text-[#F4FDFF]/40">
                              Download all your settings as a JSON file
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleExportSettings}
                          className="w-full px-4 py-3 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <Download size={18} />
                          Export Settings
                        </button>
                      </motion.div>

                      {/* Import Settings */}
                      <motion.div 
                        className="p-6 border border-[#F4FDFF]/20 rounded-xl hover:bg-[#F4FDFF]/5 transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 rounded-lg bg-[#F4FDFF]/5 mr-3">
                            <UploadIcon className="text-[#938BA1]" size={24} />
                          </div>
                          <div>
                            <h3 className="font-medium text-[#F4FDFF]">Import Settings</h3>
                            <p className="text-sm text-[#F4FDFF]/40">
                              Upload a JSON file to restore your settings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportSettings}
                            className="block w-full text-sm text-[#F4FDFF]/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#1C448E] file:text-[#F4FDFF] hover:file:bg-[#0F2A5E] transition-all duration-300 cursor-pointer"
                          />
                          <p className="text-sm text-[#F4FDFF]/40">
                            ⚠️ Note: This will overwrite your current settings
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
        className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E]"
      >
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...passwordForm.register('currentPassword')}
                  className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#938BA1] hover:text-[#F4FDFF] transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword?.message && (
                <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.currentPassword?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...passwordForm.register('newPassword')}
                  className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#938BA1] hover:text-[#F4FDFF] transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword?.message && (
                <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.newPassword?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...passwordForm.register('confirmPassword')}
                className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none"
                placeholder="Confirm new password"
              />
              {passwordForm.formState.errors.confirmPassword?.message && (
                <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.confirmPassword?.message}</p>
              )}
            </div>

            <div className="bg-[#938BA1]/20 border border-[#938BA1]/30 rounded-xl p-4">
              <h4 className="font-medium text-[#F4FDFF] mb-1">
                🔒 Password Requirements
              </h4>
              <ul className="text-sm text-[#F4FDFF]/60 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-6 py-2.5 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl transition-all duration-300 hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
        className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E]"
      >
        <div className="space-y-4">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <AlertCircle className="text-red-400 mb-2" size={24} />
            <h4 className="font-medium text-red-400 mb-2">
              ⚠️ This action cannot be undone
            </h4>
            <p className="text-sm text-red-300/80">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-red-300/80 space-y-1 mt-2">
              <li>• All your personal information</li>
              <li>• All reported items and claims</li>
              <li>• All verification records</li>
              <li>• All messages and notifications</li>
              <li>• All settings and preferences</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F4FDFF]/80 mb-2">
              Type <span className="font-mono bg-[#F4FDFF]/10 px-2 py-1 rounded">confirm-delete</span> to proceed
            </label>
            <input
              type="text"
              placeholder="confirm-delete"
              className="w-full px-4 py-3 bg-[#F4FDFF]/5 border border-[#F4FDFF]/20 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:border-[#F4FDFF] focus:ring-2 focus:ring-[#F4FDFF]/20 transition-all duration-300 outline-none font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2.5 border border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAccountDelete}
              disabled={isLoading}
              className="px-6 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Theme Preview Modal */}
      <Modal
        isOpen={showThemePreview}
        onClose={() => setShowThemePreview(false)}
        title={`${previewTheme === 'light' ? '☀️ Light' : '🌙 Dark'} Theme Preview`}
        size="lg"
        className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E]"
      >
        <div className={`${previewTheme === 'dark' ? 'dark' : ''}`}>
          <div className={`p-6 rounded-xl ${previewTheme === 'dark' ? 'bg-blue-900 text-black' : 'bg-blue text-blue-900'}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Preview Content</h3>
              <p className={previewTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'}>
                This is how your app will look with the {previewTheme} theme.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${previewTheme === 'dark' ? 'bg-blue-800' : 'bg-blue-50'}`}>
                <h4 className="font-medium mb-2">Card Example</h4>
                <p className={`text-sm ${previewTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  This is a sample card with some content.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl">
                <span>Sample Setting</span>
                <div className="w-10 h-6 bg-[#1C448E] rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className={`px-4 py-2 rounded-xl ${previewTheme === 'dark' ? 'bg-[#1C448E] hover:bg-[#0F2A5E]' : 'bg-[#1C448E] hover:bg-[#0F2A5E]'} text-black transition-all duration-300`}>
                  Primary Button
                </button>
                <button className={`px-4 py-2 border rounded-xl transition-all duration-300 ${previewTheme === 'dark' ? 'border-blue-700 hover:bg-blue-800' : 'border-blue-300 hover:bg-blue-50'}`}>
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={() => setShowThemePreview(false)} 
            className="px-6 py-2.5 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl transition-all duration-300 hover:shadow-xl"
          >
            Close Preview
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Settings