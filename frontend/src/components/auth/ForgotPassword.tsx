import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import toast from 'react-hot-toast'

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEmailSent(true)
      toast.success('Password reset link sent to your email')
    } catch (error) {
      toast.error('Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isEmailSent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-green-700 mb-4">
              We've sent a password reset link to your email address.
            </p>
            <Link to="/login">
              <Button variant="outline" fullWidth>
                <ArrowLeft className="inline mr-2" size={16} />
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="you@example.com"
            />

            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Send reset link
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword