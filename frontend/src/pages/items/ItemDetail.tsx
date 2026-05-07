import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  MapPin, 
  Calendar, 
  User, 
  Shield, 
  DollarSign,
  Clock,
  MessageCircle,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Flag,
  Phone,
  Mail,
  Image as ImageIcon,
  Tag,
  Lock,
  MoreVertical
} from 'lucide-react'
import Button from '../../components/common/UI/Button'
import Alert from '../../components/common/Feedback/Alert'
import { format } from 'date-fns'
import { useAuth } from '../../contexts/AuthContext'
import type { Item } from '../../types/item.types'

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    fetchItemDetails()
  }, [id])

  const fetchItemDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockItem: Item = {
        id: id || '1',
        title: 'Lost iPhone 14 Pro Max',
        description: 'Black iPhone 14 Pro Max lost near Central Park. The phone has a black leather case with a small scratch on the back. It was lost while jogging in the morning. The phone is locked but may still have battery.',
        category: 'electronics',
        itemType: 'lost',
        status: 'open',
        location: {
          type: "Point",
          coordinates: [-73.9654, 40.7829],
          address: 'Central Park, Near Bethesda Fountain, New York, NY 10024',
          city: 'New York',
          country: 'USA',
        },
        dateLostFound: '2024-01-15T08:30:00Z',
        images: [
          { 
            url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
            publicId: 'image1', 
            isVerified: true,
            uploadedAt: '2024-01-15T09:00:00Z'
          },
          { 
            url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80', 
            publicId: 'image2', 
            isVerified: true,
            uploadedAt: '2024-01-15T09:00:00Z'
          },
          { 
            url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
            publicId: 'image3', 
            isVerified: true,
            uploadedAt: '2024-01-15T09:00:00Z'
          },
        ],
        identifyingFeatures: [
          'Black leather case',
          'Small scratch on back',
          'Screen protector installed',
          'Red charging cable in case',
          'Phone number ending in 4567',
        ],
        reward: 200,
        reportedBy: {
          id: 'user123',
          fullName: 'John Smith',
          email: 'john@example.com',
          phone: '+1234567890',
          profileImage: undefined
        },
        claimedBy: undefined,
        secureCode: 'A1B2C3',
        isAnonymous: false,
        metadata: {
          color: 'Black',
          brand: 'Apple',
          serialNumber: 'ABCD123456789',
          model: 'iPhone 14 Pro Max',
        },
        verificationScore: 92,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
      }
      
      setItem(mockItem)
    } catch (error) {
      console.error('Error fetching item details:', error)
      setError('Failed to load item details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimItem = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/items/${id}` } })
      return
    }

    if (!user.identityVerified) {
      navigate('/verify', { state: { from: `/items/${id}` } })
      return
    }

    setIsClaiming(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShowClaimModal(false)
      navigate('/claims/new/' + id)
    } catch (error) {
      console.error('Error claiming item:', error)
      alert('Failed to claim item. Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  const handleReportIssue = () => {
    // In real app, this would open a report modal
    alert('Report feature coming soon!')
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy • hh:mm a')
  }

  const getStatusBadge = () => {
    if (!item) return null
    
    const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      open: { color: 'bg-green-100 text-green-800', icon: <AlertCircle size={14} />, label: 'Open' },
      claimed: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} />, label: 'Claimed' },
      matched: { color: 'bg-blue-100 text-blue-800', icon: <Shield size={14} />, label: 'Matched' },
      resolved: { color: 'bg-purple-100 text-purple-800', icon: <CheckCircle size={14} />, label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle size={14} />, label: 'Closed' },
    }

    const config = configs[item.status] || configs.open
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span className="mr-1.5">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const getTypeBadge = () => {
    if (!item) return null
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        item.itemType === 'lost' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The item you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/search')}>
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === item.reportedBy.id
  const canClaim = !isOwner && item.status === 'open' && item.itemType === 'found'
  const canContact = !isOwner && item.status === 'open'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              {getTypeBadge()}
              {getStatusBadge()}
              {item.verificationScore >= 80 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Shield size={14} className="mr-1.5" />
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{item.location.address}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Share2 size={18} className="mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleReportIssue}>
              <Flag size={18} className="mr-2" />
              Report
            </Button>
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
            {item.images && item.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.images[activeImage]?.url}
                    alt={`Item ${activeImage + 1}`}
                    className="w-full h-96 object-contain"
                  />
                  {item.images[activeImage]?.isVerified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Shield size={12} className="mr-1.5" />
                      Verified
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {item.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          activeImage === index
                            ? 'border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        {image.isVerified && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <Shield size={10} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No images available</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Identifying Features */}
          {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Tag className="inline mr-2" size={20} />
                Identifying Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.identifyingFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Date & Time</h3>
                <div className="flex items-center text-gray-900">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {formatDate(item.dateLostFound)}
                </div>
              </div>
              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Item Specifications</h3>
                  <div className="space-y-1">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex">
                          <span className="text-gray-600 w-32 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <User className="inline mr-2" size={20} />
              Reported By
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <User size={24} className="text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {item.isAnonymous ? 'Anonymous User' : item.reportedBy.fullName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {!item.isAnonymous && (
                      <Shield size={12} className="mr-1 text-green-500" />
                    )}
                    <span>
                      {item.isAnonymous ? 'Identity hidden' : 'Member since 2023'}
                    </span>
                  </div>
                </div>
              </div>
              
              {!item.isAnonymous && canContact && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowContactModal(true)}
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Contact Reporter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reward */}
          {item.reward && item.reward > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <DollarSign className="inline mr-2" size={20} />
                Reward
              </h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${item.reward}
                </div>
                <p className="text-gray-600">
                  Offered for the safe return of this item
                </p>
              </div>
            </div>
          )}

          {/* Status & Verification */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <Shield className="inline mr-2" size={20} />
              Status & Verification
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Verification Score</span>
                  <span className="text-sm font-bold">{item.verificationScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${item.verificationScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reported</span>
                  <span className="text-sm font-medium">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">
                    {formatDate(item.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Item ID</span>
                  <span className="text-sm font-mono">{item.id}</span>
                </div>
                {item.secureCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Secure Code</span>
                    <span className="text-sm font-mono flex items-center">
                      <Lock size={12} className="mr-1" />
                      {item.secureCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canClaim && (
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setShowClaimModal(true)}
                disabled={!user}
              >
                <Eye size={20} className="mr-2" />
                {user ? 'Claim This Item' : 'Login to Claim'}
              </Button>
            )}

            {isOwner && (
              <div className="space-y-2">
                <Button variant="outline" fullWidth>
                  Edit Item
                </Button>
                <Button variant="outline" fullWidth className="text-red-600 hover:text-red-700">
                  Close Report
                </Button>
              </div>
            )}

            {canContact && !item.isAnonymous && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowContactModal(true)}
              >
                <MessageCircle size={18} className="mr-2" />
                Contact Owner
              </Button>
            )}

            <Link to="/search">
              <Button variant="outline" fullWidth>
                <ArrowLeft size={18} className="mr-2" />
                Search Similar Items
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showContactModal && !item.isAnonymous && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Contact {item.reportedBy.fullName}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone size={20} className="text-gray-400 mr-3" />
                <span className="font-medium">{item.reportedBy.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-gray-400 mr-3" />
                <span className="font-medium">{item.reportedBy.email}</span>
              </div>
              <div className="pt-4 border-t flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </Button>
                <a
                  href={`tel:${item.reportedBy.phone}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Claim This Item
            </h3>
            <Alert
              type="info"
              message="Before claiming, make sure you can provide proof of ownership or valid identification."
            />
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">You must have valid proof of ownership</span>
              </div>
              <div className="flex items-start">
                <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">Your identity must be verified</span>
              </div>
              <div className="flex items-start">
                <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">You may need to provide additional verification</span>
              </div>
            </div>
            <div className="pt-4 border-t flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowClaimModal(false)}
                disabled={isClaiming}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleClaimItem}
                isLoading={isClaiming}
              >
                Continue to Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetail