import React, { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Shield } from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import Select from '../common/UI/Select'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import type { RegisterData, IdentityType } from '../../types/auth.types'

// Schema that matches RegisterData type
const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  fullName: yup.string().required('Full name is required'),
  phone: yup.string().required('Phone number is required'),
  identityType: yup.string().required('ID type is required'),
  identityNumber: yup.string().required('ID number is required'),
  termsAccepted: yup.boolean().default(false).oneOf([true], 'You must accept the terms and conditions'),
  privacyPolicyAccepted: yup.boolean().default(false).oneOf([true], 'You must accept the privacy policy'),
  marketingConsent: yup.boolean().default(false),
})

// Use RegisterData type directly from your types
type RegisterFormData = Omit<RegisterData, 'identityType'> & {
  identityType: string;
}

interface RegisterFormProps {
  onSuccess?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const identityTypes = [
    { value: 'driving_license', label: 'Driving License' },
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'other', label: 'Other' },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: {
      termsAccepted: false,
      privacyPolicyAccepted: false,
      marketingConsent: false,
    },
  })

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setIsLoading(true)
      // Cast identityType to IdentityType for the API
      const registerData: RegisterData = {
        ...data,
        identityType: data.identityType as IdentityType
      }
      await registerUser(registerData)
      toast.success('Registration successful! Please verify your identity.')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle checkbox changes
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('termsAccepted', e.target.checked, { shouldValidate: true })
  }

  const handlePrivacyPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('privacyPolicyAccepted', e.target.checked, { shouldValidate: true })
  }

  const handleMarketingConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('marketingConsent', e.target.checked)
  }

  // Watch checkbox values
  const termsAccepted = watch('termsAccepted')
  const privacyPolicyAccepted = watch('privacyPolicyAccepted')
  const marketingConsent = watch('marketingConsent')
  const identityTypeValue = watch('identityType')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1234567890"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Input
          label="Email address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="you@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            label="Identity Type"
            options={identityTypes}
            value={identityTypeValue || ''}
            onChange={(value) => setValue('identityType', value, { shouldValidate: true })}
            error={errors.identityType?.message}
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            label="Identity Number"
            {...register('identityNumber')}
            error={errors.identityNumber?.message}
            placeholder="ID123456789"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Identity Verification Required</p>
            <p>
              After registration, you'll need to verify your identity to report
              or claim items. This ensures the security of our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <div className="ml-2">
            <label htmlFor="terms" className="text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600 mt-1">{errors.termsAccepted.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            checked={privacyPolicyAccepted}
            onChange={handlePrivacyPolicyChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <div className="ml-2">
            <label htmlFor="privacy" className="text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
            {errors.privacyPolicyAccepted && (
              <p className="text-sm text-red-600 mt-1">{errors.privacyPolicyAccepted.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="marketing"
            name="marketing"
            type="checkbox"
            checked={marketingConsent}
            onChange={handleMarketingConsentChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            disabled={isLoading}
          />
          <div className="ml-2">
            <label htmlFor="marketing" className="text-sm text-gray-900">
              I agree to receive marketing communications and updates
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm