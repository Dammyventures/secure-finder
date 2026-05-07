import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Shield,  Gift } from 'lucide-react'
import Button from '../../components/common/UI/Button'
import ItemForm from '../../components/items/ItemForm'
import Alert from '../../components/common/Feedback/Alert'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const ReportFound: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/report/found' } })
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
      
      toast.success('Found item reported successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error reporting found item:', error)
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
              Report Found Item
            </h1>
            <p className="text-gray-600">
              Help reunite lost items with their owners by reporting what you found
            </p>
          </div>
          <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <CheckCircle size={18} className="mr-2" />
            <span className="font-medium">Found Item</span>
          </div>
        </div>
      </div>

      {/* Verification Warning */}
      {!user?.identityVerified && (
        <Alert
          type="warning"
          title="Identity Verification Required"
          message="You need to verify your identity before reporting found items. This ensures the security of our platform."
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ItemForm
              type="found"
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>

        {/* Sidebar - Tips & Information */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-3">
              <Shield className="inline mr-2" size={20} />
              Good Samaritan Tips
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Keep the item in a safe place until claimed</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Don't share sensitive information from the item</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Take clear photos from multiple angles</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Note the exact location and time found</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">✓</span>
                <span>Check for identification without violating privacy</span>
              </li>
            </ul>
          </div>

          {/* Rewards & Recognition */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-900 mb-3">
              <Gift className="inline mr-2" size={20} />
              Rewards & Recognition
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Gift size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Earn Rewards</p>
                  <p className="text-sm text-yellow-800">
                    Many owners offer rewards for returned items
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Trust Badge</p>
                  <p className="text-sm text-yellow-800">
                    Build your reputation as a trusted finder
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Secure Exchange</p>
                  <p className="text-sm text-yellow-800">
                    We facilitate safe, verified returns
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
                  <p className="font-medium text-gray-900">Publication</p>
                  <p className="text-sm text-gray-600">
                    Your found item will be listed in our database
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Matching</p>
                  <p className="text-sm text-gray-600">
                    Our system matches with lost item reports
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Owner Contact</p>
                  <p className="text-sm text-gray-600">
                    We'll connect you with potential owners
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Secure Return</p>
                  <p className="text-sm text-gray-600">
                    Facilitate safe return with verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">Legal Information</h3>
            <p className="text-sm text-gray-600">
              By reporting a found item, you agree to make reasonable efforts to return it to its rightful owner. 
              Most jurisdictions require finders to report valuable items to local authorities.
            </p>
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

export default ReportFound