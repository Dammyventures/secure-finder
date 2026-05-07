import React, { forwardRef, useState } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'filled'
  fullWidth?: boolean
  showCount?: boolean
  maxLength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'outline',
      fullWidth = true,
      showCount = false,
      maxLength,
      resize = 'vertical',
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(value?.toString().length || 0)
    
    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength && e.target.value.length > maxLength) {
        return
      }
      
      setCharCount(e.target.value.length)
      if (onChange) {
        onChange(e)
      }
    }
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[80px]',
      md: 'px-4 py-2.5 min-h-[100px]',
      lg: 'px-5 py-3 text-lg min-h-[120px]',
    }
    
    // Variant classes
    const variantClasses = {
      outline: 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
      filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
    }
    
    // Resize classes
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }
    
    // Width class
    const widthClass = fullWidth ? 'w-full' : ''
    
    return (
      <div className={widthClass}>
        {label && (
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {showCount && maxLength && (
              <span className={`text-xs ${charCount > maxLength ? 'text-red-600' : 'text-gray-500'}`}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${resizeClasses[resize]}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${widthClass}
              rounded-md transition-colors duration-200
              focus:outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />
        </div>
        
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
        
        {!label && showCount && maxLength && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${charCount > maxLength ? 'text-red-600' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea