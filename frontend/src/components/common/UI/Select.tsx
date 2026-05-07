import React, { forwardRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'filled'
  fullWidth?: boolean
  onChange?: (value: string) => void
  icon?: React.ReactNode
  searchable?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      size = 'md',
      variant = 'outline',
      fullWidth = false,
      value,
      onChange,
      icon,
      searchable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedLabel, setSelectedLabel] = useState('')
    
    // Find selected option
    React.useEffect(() => {
      if (value) {
        const selectedOption = options.find(opt => opt.value === value)
        setSelectedLabel(selectedOption?.label || '')
      } else {
        setSelectedLabel('')
      }
    }, [value, options])
    
    // Filter options based on search
    const filteredOptions = searchable && search
      ? options.filter(opt => 
          opt.label.toLowerCase().includes(search.toLowerCase()) ||
          opt.value.toLowerCase().includes(search.toLowerCase())
        )
      : options
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-5 py-3 text-lg',
    }
    
    // Variant classes
    const variantClasses = {
      outline: 'border border-gray-300 focus:border-blue-500',
      filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500',
    }
    
    // Width class
    const widthClass = fullWidth ? 'w-full' : ''
    
    // Handle option click
    const handleOptionClick = (optionValue: string) => {
      if (onChange) {
        onChange(optionValue)
      }
      setIsOpen(false)
      setSearch('')
    }
    
    return (
      <div className={`relative ${widthClass}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            className={`
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${error ? 'border-red-500' : ''}
              ${icon ? 'pl-10' : 'pl-4'}
              pr-10
              ${widthClass}
              text-left rounded-md transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              flex items-center justify-between
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            onClick={() => setIsOpen(!isOpen)}
            disabled={props.disabled}
          >
            <div className="flex items-center space-x-2">
              {icon && <span className="text-gray-400">{icon}</span>}
              <span className={!selectedLabel ? 'text-gray-400' : ''}>
                {selectedLabel || placeholder}
              </span>
            </div>
            <ChevronDown 
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
              size={16}
            />
          </button>
          
          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
              
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                <div className="py-1">
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`
                        w-full px-4 py-2 text-left text-sm
                        flex items-center justify-between
                        hover:bg-gray-50 transition-colors duration-150
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}
                      `}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center space-x-2">
                        {option.icon && <span className="text-gray-400">{option.icon}</span>}
                        <span>{option.label}</span>
                      </div>
                      {value === option.value && (
                        <Check className="text-blue-600" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Hidden select for form submission */}
        <select
          ref={ref}
          className="hidden"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
        
        {/* Close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select