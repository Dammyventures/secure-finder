import React from 'react'

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'ring' | 'bars'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
  fullScreen?: boolean
  className?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  
  // Color classes
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  }
  
  // Variant renderers
  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <svg
              className={`${colorClasses[color]} w-full h-full`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )
      
      case 'dots':
        return (
          <div className={`${sizeClasses[size]} flex space-x-1`}>
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={`w-1/3 h-full rounded-full ${colorClasses[color]} animate-bounce`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )
      
      case 'ring':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className={`w-full h-full rounded-full border-2 ${colorClasses[color]} border-opacity-20`} />
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full border-2 ${colorClasses[color]} border-t-transparent animate-spin`}
            />
          </div>
        )
      
      case 'bars':
        return (
          <div className={`${sizeClasses[size]} flex space-x-1`}>
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '100ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '200ms' }}
            />
            <div
              className={`w-1/4 h-full ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )
      
      default:
        return null
    }
  }
  
  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center">
          {renderVariant()}
          {text && (
            <p className="mt-4 text-gray-600 font-medium">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  // Regular loader
  return (
    <div className={`flex items-center ${className}`}>
      {renderVariant()}
      {text && (
        <span className="ml-3 text-gray-600">
          {text}
        </span>
      )}
    </div>
  )
}

export default Loader