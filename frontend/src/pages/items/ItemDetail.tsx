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
  MoreVertical,
  X
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
            url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
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
    alert('Report feature coming soon!')
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy • hh:mm a')
  }

  const getStatusBadge = () => {
    if (!item) return null
    
    const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      open: { color: 'bg-green-500/20 text-green-400 border border-green-500/30', icon: <AlertCircle size={14} />, label: 'Open' },
      claimed: { color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', icon: <Clock size={14} />, label: 'Claimed' },
      matched: { color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', icon: <Shield size={14} />, label: 'Matched' },
      resolved: { color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', icon: <CheckCircle size={14} />, label: 'Resolved' },
      closed: { color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', icon: <AlertCircle size={14} />, label: 'Closed' },
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
          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}>
        {item.itemType === 'lost' ? 'Lost Item' : 'Found Item'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4FDFF] mx-auto"></div>
          <p className="mt-4 text-[#F4FDFF]/60">Loading item details...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-[#938BA1] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F4FDFF] mb-2">
            Item Not Found
          </h2>
          <p className="text-[#F4FDFF]/60 mb-6">
            {error || 'The item you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/search')} className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E]">
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
    <div className="min-h-screen bg-gradient-to-br from-[#1C448E] via-[#0F2A5E] to-[#1C448E] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Button>
        </div>

        {/* Header */}
        <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                {getTypeBadge()}
                {getStatusBadge()}
                {item.verificationScore >= 80 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <Shield size={14} className="mr-1.5" />
                    Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#F4FDFF] mb-2">
                {item.title}
              </h1>
              <div className="flex items-center text-[#F4FDFF]/60">
                <MapPin size={16} className="mr-2" />
                <span>{item.location.address}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl">
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleReportIssue} className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl">
                <Flag size={18} className="mr-2" />
                Report
              </Button>
              <button className="p-2 text-[#F4FDFF]/40 hover:text-[#F4FDFF] transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">Images</h2>
              {item.images && item.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative bg-[#F4FDFF]/5 rounded-xl overflow-hidden">
                    <img
                      src={item.images[activeImage]?.url}
                      alt={`Item ${activeImage + 1}`}
                      className="w-full h-96 object-contain"
                    />
                    {item.images[activeImage]?.isVerified && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] px-3 py-1 rounded-full text-sm font-medium flex items-center">
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
                          className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                            activeImage === index
                              ? 'border-[#F4FDFF] shadow-lg'
                              : 'border-[#F4FDFF]/20 hover:border-[#F4FDFF]/40'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          {image.isVerified && (
                            <div className="absolute top-1 right-1 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] rounded-full w-5 h-5 flex items-center justify-center">
                              <Shield size={10} className="text-[#1C448E]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-[#938BA1] mx-auto mb-4" />
                  <p className="text-[#F4FDFF]/60">No images available</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">Description</h2>
              <p className="text-[#F4FDFF]/70 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Identifying Features */}
            {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
              <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">
                  <Tag className="inline mr-2" size={20} />
                  Identifying Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.identifyingFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 bg-[#1C448E]/30 text-[#F4FDFF]/80 rounded-xl border border-[#F4FDFF]/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-[#938BA1] mb-2">Date & Time</h3>
                  <div className="flex items-center text-[#F4FDFF]/80">
                    <Calendar size={16} className="mr-2 text-[#938BA1]" />
                    {formatDate(item.dateLostFound)}
                  </div>
                </div>
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#938BA1] mb-2">Item Specifications</h3>
                    <div className="space-y-1">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex text-[#F4FDFF]/70">
                            <span className="w-32 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-medium text-[#F4FDFF]">{value}</span>
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
            <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">
                <User className="inline mr-2" size={20} />
                Reported By
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1C448E] to-[#0F2A5E] rounded-full flex items-center justify-center mr-3 border border-[#F4FDFF]/20">
                    <User size={24} className="text-[#F4FDFF]/60" />
                  </div>
                  <div>
                    <div className="font-medium text-[#F4FDFF]">
                      {item.isAnonymous ? 'Anonymous User' : item.reportedBy.fullName}
                    </div>
                    <div className="flex items-center text-sm text-[#F4FDFF]/40">
                      {!item.isAnonymous && (
                        <Shield size={12} className="mr-1 text-[#938BA1]" />
                      )}
                      <span>
                        {item.isAnonymous ? 'Identity hidden' : 'Member since 2023'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!item.isAnonymous && canContact && (
                  <div className="pt-4 border-t border-[#F4FDFF]/10">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setShowContactModal(true)}
                      className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl"
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
              <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">
                  <DollarSign className="inline mr-2" size={20} />
                  Reward
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] bg-clip-text text-transparent mb-2">
                    ${item.reward}
                  </div>
                  <p className="text-[#F4FDFF]/60">
                    Offered for the safe return of this item
                  </p>
                </div>
              </div>
            )}

            {/* Status & Verification */}
            <div className="bg-[#F4FDFF]/5 backdrop-blur-xl rounded-2xl border border-[#F4FDFF]/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#F4FDFF] mb-4">
                <Shield className="inline mr-2" size={20} />
                Status & Verification
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#F4FDFF]/60">Verification Score</span>
                    <span className="text-sm font-bold text-[#F4FDFF]">{item.verificationScore}%</span>
                  </div>
                  <div className="w-full bg-[#F4FDFF]/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.verificationScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-[#F4FDFF]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#F4FDFF]/40">Reported</span>
                    <span className="text-sm font-medium text-[#F4FDFF]/80">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#F4FDFF]/40">Last Updated</span>
                    <span className="text-sm font-medium text-[#F4FDFF]/80">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#F4FDFF]/40">Item ID</span>
                    <span className="text-sm font-mono text-[#F4FDFF]/80">{item.id}</span>
                  </div>
                  {item.secureCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F4FDFF]/40">Secure Code</span>
                      <span className="text-sm font-mono flex items-center text-[#F4FDFF]/80">
                        <Lock size={12} className="mr-1 text-[#938BA1]" />
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
                  className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl hover:shadow-xl font-semibold"
                >
                  <Eye size={20} className="mr-2" />
                  {user ? 'Claim This Item' : 'Login to Claim'}
                </Button>
              )}

              {isOwner && (
                <div className="space-y-2">
                  <Button variant="outline" fullWidth className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl">
                    Edit Item
                  </Button>
                  <Button variant="outline" fullWidth className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">
                    Close Report
                  </Button>
                </div>
              )}

              {canContact && !item.isAnonymous && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowContactModal(true)}
                  className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Contact Owner
                </Button>
              )}

              <Link to="/search">
                <Button variant="outline" fullWidth className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl">
                  <ArrowLeft size={18} className="mr-2" />
                  Search Similar Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && !item.isAnonymous && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E] rounded-2xl max-w-md w-full p-6 border border-[#F4FDFF]/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#F4FDFF]">
                Contact {item.reportedBy.fullName}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 hover:bg-[#F4FDFF]/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-[#F4FDFF]/60" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                <Phone size={20} className="text-[#938BA1] mr-3" />
                <span className="font-medium text-[#F4FDFF]">{item.reportedBy.phone}</span>
              </div>
              <div className="flex items-center p-3 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                <Mail size={20} className="text-[#938BA1] mr-3" />
                <span className="font-medium text-[#F4FDFF]">{item.reportedBy.email}</span>
              </div>
              <div className="pt-4 border-t border-[#F4FDFF]/10 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                  className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl"
                >
                  Cancel
                </Button>
                <a
                  href={`tel:${item.reportedBy.phone}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl hover:shadow-xl font-semibold transition-all duration-300"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1C448E] to-[#0F2A5E] rounded-2xl max-w-md w-full p-6 border border-[#F4FDFF]/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#F4FDFF]">
                Claim This Item
              </h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="p-1 hover:bg-[#F4FDFF]/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-[#F4FDFF]/60" />
              </button>
            </div>
            <div className="bg-[#938BA1]/20 border border-[#938BA1]/30 rounded-xl p-4 mb-4">
              <p className="text-[#F4FDFF]/80 text-sm">
                Before claiming, make sure you can provide proof of ownership or valid identification.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                <CheckCircle size={18} className="text-[#938BA1] mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-[#F4FDFF]/70">You must have valid proof of ownership</span>
              </div>
              <div className="flex items-start p-3 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                <CheckCircle size={18} className="text-[#938BA1] mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-[#F4FDFF]/70">Your identity must be verified</span>
              </div>
              <div className="flex items-start p-3 bg-[#F4FDFF]/5 rounded-xl border border-[#F4FDFF]/10">
                <CheckCircle size={18} className="text-[#938BA1] mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-[#F4FDFF]/70">You may need to provide additional verification</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[#F4FDFF]/10 flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowClaimModal(false)}
                disabled={isClaiming}
                className="border-[#F4FDFF]/20 text-[#F4FDFF] hover:bg-[#F4FDFF]/10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleClaimItem}
                isLoading={isClaiming}
                className="bg-gradient-to-r from-[#F4FDFF] to-[#938BA1] text-[#1C448E] rounded-xl hover:shadow-xl font-semibold"
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