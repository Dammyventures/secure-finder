import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Shield, MapPin } from 'lucide-react'
import Button from '../../components/common/UI/Button'
import ItemForm from '../../components/items/ItemForm'
import Alert from '../../components/common/Feedback/Alert'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const ReportLost: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/report/lost' } })
      return
    }

    if (!user.identityVerified) {
      toast.error('Please verify your identity first')
      navigate('/verify')
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Lost item reported successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error reporting lost item:', error)
      toast.error('Failed to report item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report Lost Item
            </h1>
            <p className="text-gray-600">
              Provide details about your lost item to help others find it
            </p>
          </div>
          <div className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
            <AlertCircle size={18} className="mr-2" />
            <span className="font-medium">Lost Item</span>
          </div>
        </div>
      </div>

      {/* Verification Warning */}
      {!user?.identityVerified && (
        <Alert
          type="warning"
          title="Identity Verification Required"
          message="You need to verify your identity before reporting lost items. This ensures the security of our platform."
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ItemForm
              type="lost"
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>

        {/* Sidebar - Tips & Information */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">
              <Shield className="inline mr-2" size={20} />
              Tips for Reporting
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Provide clear, recent photos of the item</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Include unique identifying features</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Be specific about location and time</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Offer a reward to increase chances of recovery</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Keep your contact information updated</span>
              </li>
            </ul>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-3">Security Features</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Shield size={18} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Secure Verification</p>
                  <p className="text-sm text-gray-600">
                    All claims are verified through our secure system
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Location Privacy</p>
                  <p className="text-sm text-gray-600">
                    Exact locations are protected until verification
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield size={18} className="text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Secure Codes</p>
                  <p className="text-sm text-gray-600">
                    Unique codes for item verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Submission Review</p>
                  <p className="text-sm text-gray-600">
                    Your report will be reviewed and published
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Matching & Alerts</p>
                  <p className="text-sm text-gray-600">
                    Our system will match with found items and notify users
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Claim Verification</p>
                  <p className="text-sm text-gray-600">
                    We'll verify any claims with secure protocols
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          <Button
            variant="outline"
            fullWidth
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel Report
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReportLost