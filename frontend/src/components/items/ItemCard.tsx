import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Calendar, 
  User, 
  Shield,
  DollarSign,
  Clock,
  Eye,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Button from '../common/UI/Button'
import type { Item } from '../../types/item.types'

interface ItemCardProps {
  item: Item
  onClick?: () => void
  showActions?: boolean
  onClaim?: () => void
  onContact?: () => void
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  showActions = false,
  onClaim,
  onContact,
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      open: {
        text: 'Open',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: <AlertCircle size={12} />
      },
      claimed: {
        text: 'Claimed',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: <Clock size={12} />
      },
      matched: {
        text: 'Matched',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: <Shield size={12} />
      },
      resolved: {
        text: 'Resolved',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        icon: <CheckCircle size={12} />
      },
      closed: {
        text: 'Closed',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: <AlertCircle size={12} />
      }
    }

    const config = statusConfig[item.status] || statusConfig.open

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </div>
    )
  }

  const getTypeBadge = () => {
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        item.itemType === 'lost' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {item.itemType === 'lost' ? 'Lost' : 'Found'}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      electronics: '📱',
      documents: '📄',
      jewelry: '💎',
      bags: '🎒',
      clothing: '👕',
      keys: '🔑',
      pets: '🐾',
      other: '📦'
    }
    return icons[item.category] || '📦'
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0].url}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-5xl">{getCategoryIcon()}</div>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getTypeBadge()}
          {getStatusBadge()}
        </div>

        {/* Reward Badge */}
        {item.reward && item.reward > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center">
            <DollarSign size={10} className="mr-1" />
            ${item.reward}
          </div>
        )}

        {/* Verification Score */}
        {item.verificationScore && item.verificationScore >= 80 && (
          <div className="absolute bottom-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Shield size={10} className="mr-1" />
            Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">{getCategoryIcon()}</span>
            <span className="capitalize">{item.category.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Identifying Features */}
        {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {item.identifyingFeatures.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                >
                  {feature}
                </span>
              ))}
              {item.identifyingFeatures.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{item.identifyingFeatures.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          {/* Location */}
          <div className="flex items-center">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{item.location.address || `${item.location.city}, ${item.location.country}`}</span>
          </div>

          {/* Date */}
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 flex-shrink-0" />
            <span>{formatDate(item.dateLostFound)}</span>
          </div>

          {/* Reporter */}
          {!item.isAnonymous && item.reportedBy && (
            <div className="flex items-center">
              <User size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {typeof item.reportedBy === 'object' && 'fullName' in item.reportedBy
                  ? (item.reportedBy as { fullName: string }).fullName 
                  : 'User'}
              </span>
              {item.reportedBy && typeof item.reportedBy === 'object' && 'identityVerified' in item.reportedBy && (item.reportedBy as { identityVerified?: boolean }).identityVerified && (
                <Shield 
                  size={12} 
                  className="ml-2 text-green-500 flex-shrink-0"
                  aria-label="Verified User"
                />
              )}
            </div>
          )}

          {/* Posted Time */}
          <div className="flex items-center">
            <Clock size={14} className="mr-2 flex-shrink-0" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation()
                onClaim?.()
              }}
              className="flex items-center justify-center"
            >
              <Eye size={14} className="mr-1" />
              Claim Item
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation()
                onContact?.()
              }}
              className="flex items-center justify-center"
            >
              <MessageCircle size={14} className="mr-1" />
              Contact
            </Button>
          </div>
        )}

        {/* View Details Link */}
        {!showActions && (
          <div className="pt-3 border-t border-gray-100">
            <Link
              to={`/items/${item.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemCard