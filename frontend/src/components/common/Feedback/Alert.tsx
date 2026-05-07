import React from 'react'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  className?: string
  showIcon?: boolean
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  className = '',
  showIcon = true,
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }

  const borderColors = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200',
  }

  return (
    <div
      className={`rounded-lg border ${borderColors[type]} ${bgColors[type]} p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className={`flex-shrink-0 ${textColors[type]}`}>
            {icons[type]}
          </div>
        )}
        <div className={`ml-3 ${showIcon ? 'ml-3' : ''}`}>
          {title && (
            <h3 className={`text-sm font-medium ${textColors[type]}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${textColors[type]}`}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert