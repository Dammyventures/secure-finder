import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  bordered?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  fullWidth?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = 'md',
  bordered = true,
  shadow = 'sm',
  hover = false,
  className = '',
  fullWidth = false,
}) => {
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  // Border classes
  const borderClass = bordered ? 'border border-gray-200' : ''
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  }
  
  // Hover effect
  const hoverClass = hover ? 'transition-shadow duration-200 hover:shadow-md' : ''
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div
      className={`
        bg-white rounded-lg
        ${borderClass}
        ${shadowClasses[shadow]}
        ${hoverClass}
        ${widthClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card