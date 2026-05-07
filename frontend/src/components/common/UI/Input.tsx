import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, Search, X } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'filled' | 'flushed'
  showClearButton?: boolean
  onClear?: () => void
  isSearch?: boolean
  isPassword?: boolean
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'outline',
      showClearButton = false,
      onClear,
      isSearch = false,
      isPassword = false,
      fullWidth = false,
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-5 py-3 text-lg',
    }
    
    // Variant classes
    const variantClasses = {
      outline: 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
      filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
      flushed: 'border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0',
    }
    
    // Width class
    const widthClass = fullWidth ? 'w-full' : ''
    
    // Input type
    const inputType = isPassword && !showPassword ? 'password' : props.type || 'text'
    
    // Handle clear
    const handleClear = () => {
      if (onClear) {
        onClear()
      } else if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }
    
    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          {isSearch && !leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${leftIcon || isSearch ? 'pl-10' : 'pl-4'}
              ${rightIcon || showClearButton || isPassword ? 'pr-10' : 'pr-4'}
              ${widthClass}
              rounded-md transition-colors duration-200
              focus:outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {showClearButton && value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            
            {rightIcon && !showClearButton && !isPassword && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
          </div>
        </div>
        
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input