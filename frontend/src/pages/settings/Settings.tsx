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
  // Profile
  fullName: string
  email: string
  phone: string
  bio: string
  language: string
  timezone: string
  dateFormat: string
  currency: string
  measurementSystem: 'metric' | 'imperial'
  
  // Preferences
  theme: 'light' | 'dark' | 'auto'
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  
  // Privacy
  profileVisibility: 'public' | 'contacts' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowMessaging: boolean
  
  // Security
  twoFactorEnabled: boolean
  twoFactorMethod: 'email' | 'sms' | 'authenticator'
  loginAlerts: boolean
  suspiciousActivityAlerts: boolean
  
  // Quiet Hours
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

// Simple Switch component placeholder
const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// Simple QrCodeGenerator placeholder
const QrCodeGenerator: React.FC<{
  value: string;
  size: number;
  className?: string;
}> = ({ value, size, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">QR Code Placeholder</div>
        <div className="text-xs text-gray-400">Value: {value.substring(0, 30)}...</div>
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
    // Profile
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    measurementSystem: 'metric',
    
    // Preferences
    theme: 'auto',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Privacy
    profileVisibility: 'contacts',
    showEmail: false,
    showPhone: false,
    showLocation: false,
    allowMessaging: true,
    
    // Security
    twoFactorEnabled: user?.twoFactorEnabled || false,
    twoFactorMethod: 'authenticator',
    loginAlerts: true,
    suspiciousActivityAlerts: true,
    
    // Quiet Hours
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
    
    // Load saved settings
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
      // Update settings with user data
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

  // Profile update handler
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

  // Password change handler
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

  // Two-factor setup
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

  // Account deletion
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

  // Session management
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authApi.revokeSession({ sessionId })
      toast.success('Session revoked')
      loadSessions() // Reload sessions
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

  // Theme handling
  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setSettings(prev => ({ ...prev, theme }))
    
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    } else {
      // Auto theme - follow system preference
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

  // Export settings
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

  // Import settings
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

  // Backup codes download
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="mr-3" size={20} />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Palette className="mr-3" size={20} />
                  Preferences
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bell className="mr-3" size={20} />
                  Notifications
                </button>

                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Shield className="mr-3" size={20} />
                  Privacy
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Lock className="mr-3" size={20} />
                  Security
                </button>

                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'sessions'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Device className="mr-3" size={20} />
                  Sessions
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'export'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Download className="mr-3" size={20} />
                  Import/Export
                </button>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="mr-3" size={20} />
                    Delete Account
                  </button>
                </div>
              </nav>
            </Card>
          </div>

          {/* Main settings area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Profile Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Update your personal information and profile details
                      </p>
                    </div>

                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <Input
                            label="Full Name"
                            {...profileForm.register('fullName')}
                            error={profileForm.formState.errors.fullName?.message}
                            leftIcon={<User size={18} />}
                          />
                        </div>

                        <div>
                          <Input
                            label="Email"
                            type="email"
                            {...profileForm.register('email')}
                            error={profileForm.formState.errors.email?.message}
                            leftIcon={<Mail size={18} />}
                          />
                        </div>

                        <div>
                          <Input
                            label="Phone Number"
                            type="tel"
                            {...profileForm.register('phone')}
                            error={profileForm.formState.errors.phone?.message}
                            leftIcon={<Phone size={18} />}
                          />
                        </div>

                        <div>
                       <Select
  label="Language"
  value={settings.language}
  onChange={(value: string) => {
    // Simulate an event if needed
    const e = { target: { value } } as React.ChangeEvent<HTMLSelectElement>;
    setSettings(prev => ({ ...prev, language: e.target.value }));
  }}
  options={[
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
  ]}
/>
                        </div>

                        <div>
                          <Select
                            label="Timezone"
                            value={settings.timezone}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
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
                          />
                        </div>

                        <div>
                          <Select
                            label="Currency"
                            value={settings.currency}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                            options={[
                              { value: 'USD', label: 'USD - US Dollar' },
                              { value: 'EUR', label: 'EUR - Euro' },
                              { value: 'GBP', label: 'GBP - British Pound' },
                              { value: 'JPY', label: 'JPY - Japanese Yen' },
                              { value: 'CAD', label: 'CAD - Canadian Dollar' },
                              { value: 'AUD', label: 'AUD - Australian Dollar' },
                            ]}
                          />
                        </div>

                        <div>
                          <Select
                            label="Date Format"
                            value={settings.dateFormat}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                            options={[
                              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            ]}
                          />
                        </div>

                        <div>
                          <Select
                            label="Measurement System"
                            value={settings.measurementSystem}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings(prev => ({ 
                              ...prev, 
                              measurementSystem: e.target.value as 'metric' | 'imperial' 
                            }))}
                            options={[
                              { value: 'metric', label: 'Metric (km, kg)' },
                              { value: 'imperial', label: 'Imperial (miles, lbs)' },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          {...profileForm.register('bio')}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          placeholder="Tell us about yourself..."
                          maxLength={500}
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                          {profileForm.watch('bio')?.length || 0}/500
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          isLoading={isLoading}
                          leftIcon={<Save size={18} />}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>

                    {/* Password Change Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Password
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordModal(true)}
                        leftIcon={<Key size={18} />}
                      >
                        Change Password
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Preferences Settings */}
                {activeTab === 'preferences' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Preferences
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Customize your app experience
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Theme
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 border rounded-lg text-center transition-all ${
                              settings.theme === 'light'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Sun className="text-yellow-500" size={24} />
                            </div>
                            <div className="font-medium">Light</div>
                            <div className="text-sm text-gray-500">Bright theme</div>
                            {settings.theme === 'light' && (
                              <div className="mt-2">
                                <Check className="text-green-500 mx-auto" size={20} />
                              </div>
                            )}
                          </button>

                          <button
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 border rounded-lg text-center transition-all ${
                              settings.theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Moon className="text-indigo-500" size={24} />
                            </div>
                            <div className="font-medium">Dark</div>
                            <div className="text-sm text-gray-500">Dark theme</div>
                            {settings.theme === 'dark' && (
                              <div className="mt-2">
                                <Check className="text-green-500 mx-auto" size={20} />
                              </div>
                            )}
                          </button>

                          <button
                            onClick={() => handleThemeChange('auto')}
                            className={`p-4 border rounded-lg text-center transition-all ${
                              settings.theme === 'auto'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Palette className="text-purple-500" size={24} />
                            </div>
                            <div className="font-medium">Auto</div>
                            <div className="text-sm text-gray-500">System default</div>
                            {settings.theme === 'auto' && (
                              <div className="mt-2">
                                <Check className="text-green-500 mx-auto" size={20} />
                              </div>
                            )}
                          </button>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleThemePreview('light')}
                          >
                            Preview Light
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleThemePreview('dark')}
                          >
                            Preview Dark
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Notifications
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Control how and when you receive notifications
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Notification Channels */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Notification Channels
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Email Notifications</div>
                                <div className="text-sm text-gray-500">Receive notifications via email</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.emailNotifications}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Bell className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Push Notifications</div>
                                <div className="text-sm text-gray-500">Receive push notifications in browser</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.pushNotifications}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">SMS Notifications</div>
                                <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.smsNotifications}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quiet Hours */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Quiet Hours
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <VolumeX className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Enable Quiet Hours</div>
                                <div className="text-sm text-gray-500">Pause notifications during specified hours</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.quietHours.enabled}
                              onChange={(checked: boolean) => setSettings(prev => ({
                                ...prev,
                                quietHours: { ...prev.quietHours, enabled: checked }
                              }))}
                            />
                          </div>

                          {settings.quietHours.enabled && (
                            <div className="grid grid-cols-2 gap-4 pl-8">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Start Time
                                </label>
                                <Input
                                  type="time"
                                  value={settings.quietHours.startTime}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                                    ...prev,
                                    quietHours: { ...prev.quietHours, startTime: e.target.value }
                                  }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  End Time
                                </label>
                                <Input
                                  type="time"
                                  value={settings.quietHours.endTime}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({
                                    ...prev,
                                    quietHours: { ...prev.quietHours, endTime: e.target.value }
                                  }))}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Privacy
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Control your privacy and visibility settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Profile Visibility
                        </h3>
                        <div className="space-y-3">
                          {[
                            { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                            { value: 'contacts', label: 'Contacts Only', description: 'Only people you connect with can see your profile' },
                            { value: 'private', label: 'Private', description: 'Only you can see your profile' },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Show Email Address</div>
                                <div className="text-sm text-gray-500">Allow others to see your email</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.showEmail}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, showEmail: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Phone className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Show Phone Number</div>
                                <div className="text-sm text-gray-500">Allow others to see your phone number</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.showPhone}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, showPhone: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Show Location</div>
                                <div className="text-sm text-gray-500">Allow others to see your approximate location</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.showLocation}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, showLocation: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Messaging */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Messaging
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MailCheck className="mr-3 text-gray-400" size={20} />
                            <div>
                              <div className="font-medium">Allow Direct Messages</div>
                              <div className="text-sm text-gray-500">Allow others to send you direct messages</div>
                            </div>
                          </div>
                          <Switch
                            checked={settings.allowMessaging}
                            onChange={(checked: boolean) => setSettings(prev => ({ ...prev, allowMessaging: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Security
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Manage your account security settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <ShieldCheck className="mr-3 text-green-500" size={24} />
                            <div>
                              <div className="font-medium">Two-Factor Authentication</div>
                              <div className="text-sm text-gray-500">
                                {settings.twoFactorEnabled 
                                  ? '2FA is enabled for your account'
                                  : 'Add an extra layer of security to your account'
                                }
                              </div>
                            </div>
                          </div>
                          {settings.twoFactorEnabled ? (
                            <Button
                              variant="danger"
                              onClick={handleTwoFactorDisable}
                              isLoading={isLoading}
                            >
                              Disable
                            </Button>
                          ) : (
                            <Button
                              onClick={handleTwoFactorSetup}
                              isLoading={isLoading}
                            >
                              Enable
                            </Button>
                          )}
                        </div>

                        {twoFactorSecret && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium mb-2">Setup Instructions</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                              <li>Click "Add Account" and scan the QR code below</li>
                              <li>Enter the 6-digit code generated by the app</li>
                            </ol>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                                {showQrCode ? (
                                  <QrCodeGenerator
                                    value={`otpauth://totp/SecureFinder:${user?.email}?secret=${twoFactorSecret}&issuer=SecureFinder`}
                                    size={160}
                                    className="bg-white p-2 rounded"
                                  />
                                ) : (
                                  <div className="w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowQrCode(true)}
                                      leftIcon={<QrCode size={20} />}
                                    >
                                      Show QR Code
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-2">
                                    Manual Entry Code
                                  </label>
                                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                                    {twoFactorSecret}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-2">
                                    Verification Code
                                  </label>
                                  <Input
                                    type="text"
                                    value={twoFactorCode}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwoFactorCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                  />
                                </div>

                                <Button
                                  onClick={handleTwoFactorVerify}
                                  isLoading={isLoading}
                                  className="w-full"
                                >
                                  Verify & Enable
                                </Button>
                              </div>
                            </div>

                            {backupCodes.length > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">Backup Codes</h4>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadBackupCodes}
                                    leftIcon={<Download size={16} />}
                                  >
                                    Download
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {backupCodes.map((code, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center font-mono text-sm"
                                    >
                                      {code}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                  Save these codes in a secure place. Each code can be used once.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Security Alerts */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Security Alerts
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Bell className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Login Alerts</div>
                                <div className="text-sm text-gray-500">Get notified of new logins to your account</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.loginAlerts}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, loginAlerts: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <AlertCircle className="mr-3 text-gray-400" size={20} />
                              <div>
                                <div className="font-medium">Suspicious Activity Alerts</div>
                                <div className="text-sm text-gray-500">Get notified of suspicious account activity</div>
                              </div>
                            </div>
                            <Switch
                              checked={settings.suspiciousActivityAlerts}
                              onChange={(checked: boolean) => setSettings(prev => ({ ...prev, suspiciousActivityAlerts: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Recent Security Events */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Recent Security Events
                        </h3>
                        <div className="space-y-2">
                          {securityEvents.slice(0, 5).map((event) => (
                            <div
                              key={event.id}
                              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{event.action}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-sm">
                                  {event.ipAddress} • {event.location?.city || 'Unknown location'}
                                </div>
                              </div>
                            </div>
                          ))}
                          {securityEvents.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
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
                  <Card>
                    <div className="mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Active Sessions
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Manage your active login sessions
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleRevokeAllSessions}
                          disabled={sessions.length <= 1}
                        >
                          Revoke All Other Sessions
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                                <Device size={20} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-medium">{session.device.type}</div>
                                <div className="text-sm text-gray-500">
                                  {session.device.os} • {session.device.browser}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  Last active: {new Date(session.lastActive).toLocaleString()}
                                </div>
                                {session.location && (
                                  <div className="text-sm text-gray-500">
                                    {session.location.city}, {session.location.country}
                                  </div>
                                )}
                                {session.current && (
                                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">
                                    Current Session
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm text-gray-500">
                                IP: {session.ipAddress}
                              </div>
                              {!session.current && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleRevokeSession(session.id)}
                                >
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {sessions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No active sessions found
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Import/Export Settings */}
                {activeTab === 'export' && (
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Import & Export
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Backup or restore your settings
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Export Settings */}
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center mb-4">
                          <Download className="mr-3 text-blue-500" size={24} />
                          <div>
                            <h3 className="font-medium">Export Settings</h3>
                            <p className="text-sm text-gray-500">
                              Download all your settings as a JSON file
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleExportSettings}
                          leftIcon={<Download size={18} />}
                          className="w-full"
                        >
                          Export Settings
                        </Button>
                      </div>

                      {/* Import Settings */}
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center mb-4">
                          <UploadIcon className="mr-3 text-green-500" size={24} />
                          <div>
                            <h3 className="font-medium">Import Settings</h3>
                            <p className="text-sm text-gray-500">
                              Upload a JSON file to restore your settings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportSettings}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                          />
                          <p className="text-sm text-gray-500">
                            Note: This will overwrite your current settings
                          </p>
                        </div>
                      </div>
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
      >
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...passwordForm.register('currentPassword')}
                  error={passwordForm.formState.errors.currentPassword?.message}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  {...passwordForm.register('newPassword')}
                  error={passwordForm.formState.errors.newPassword?.message}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                Password Requirements
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <AlertCircle className="text-red-500 mb-2" size={24} />
            <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">
              This action cannot be undone
            </h4>
            <p className="text-sm text-red-700 dark:text-red-500">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-500 space-y-1 mt-2">
              <li>• All your personal information</li>
              <li>• All reported items and claims</li>
              <li>• All verification records</li>
              <li>• All messages and notifications</li>
              <li>• All settings and preferences</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Type "confirm-delete" to proceed
            </label>
            <Input
              type="text"
              placeholder="confirm-delete"
              className="font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleAccountDelete}
              isLoading={isLoading}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Theme Preview Modal */}
      <Modal
        isOpen={showThemePreview}
        onClose={() => setShowThemePreview(false)}
        title={`${previewTheme === 'light' ? 'Light' : 'Dark'} Theme Preview`}
        size="lg"
      >
        <div className={`${previewTheme === 'dark' ? 'dark' : ''}`}>
          <div className={`p-6 rounded-lg ${previewTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Preview Content</h3>
              <p className={`${previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                This is how your app will look with the {previewTheme} theme.
              </p>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded ${previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-2">Card Example</h4>
                <p className={`text-sm ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  This is a sample card with some content.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded">
                <span>Sample Setting</span>
                <div className="w-10 h-6 bg-blue-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className={`px-4 py-2 rounded ${previewTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                  Primary Button
                </button>
                <button className={`px-4 py-2 border rounded ${previewTheme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => setShowThemePreview(false)}>
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Settings