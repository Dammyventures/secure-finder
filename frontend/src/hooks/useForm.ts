import { useState, useCallback, useEffect } from 'react'
import { ValidationError } from 'yup'

interface UseFormOptions<T> {
  initialValues: T
  validationSchema?: any
  onSubmit: (values: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

interface UseFormReturn<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  setFieldValue: (field: string, value: any) => void
  setFieldError: (field: string, error: string) => void
  setFieldTouched: (field: string, touched?: boolean) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  resetForm: (values?: T) => void
  validateForm: () => Promise<boolean>
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Validate field
  const validateField = useCallback(
    async (field: string, value: any) => {
      if (!validationSchema) return

      try {
        await validationSchema.validateAt(field, { [field]: value })
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      } catch (error) {
        if (error instanceof ValidationError) {
          setErrors((prev) => ({
            ...prev,
            [field]: error.message,
          }))
        }
      }
    },
    [validationSchema]
  )

  // Validate entire form
  const validateForm = useCallback(async () => {
    if (!validationSchema) {
      setIsValid(true)
      return true
    }

    try {
      await validationSchema.validate(values, { abortEarly: false })
      setErrors({})
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message
          }
        })
        setErrors(newErrors)
        setIsValid(false)
        return false
      }
      return false
    }
  }, [validationSchema, values])

  // Handle field change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target

      let newValue: any = value

      // Handle different input types
      if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement
        newValue = checkbox.checked
      } else if (type === 'number') {
        newValue = value === '' ? '' : Number(value)
      } else if (type === 'file') {
        const fileInput = e.target as HTMLInputElement
        newValue = fileInput.files?.[0] || null
      }

      // Update values
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }))

      // Update touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }))

      // Validate on change if enabled
      if (validateOnChange) {
        validateField(name, newValue)
      }
    },
    [validateField, validateOnChange]
  )

  // Handle field blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target

      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }))

      // Validate on blur if enabled
      if (validateOnBlur) {
        validateField(name, values[name as keyof T])
      }
    },
    [validateField, validateOnBlur, values]
  )

  // Set field value manually
  const setFieldValue = useCallback(
    (field: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (validateOnChange) {
        validateField(field, value)
      }
    },
    [validateField, validateOnChange]
  )

  // Set field error manually
  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }))
  }, [])

  // Set field touched manually
  const setFieldTouched = useCallback((field: string, touchedValue: boolean = true) => {
    setTouched((prev) => ({
      ...prev,
      [field]: touchedValue,
    }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {}
      Object.keys(values).forEach((key) => {
        allTouched[key] = true
      })
      setTouched(allTouched)

      // Validate form
      const isValid = await validateForm()
      if (!isValid) {
        return
      }

      // Submit form
      try {
        setIsSubmitting(true)
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, values, validateForm]
  )

  // Reset form
  const resetForm = useCallback((newValues?: T) => {
    setValues(newValues || initialValues)
    setErrors({})
    setTouched({})
    setIsValid(false)
  }, [initialValues])

  // Auto-validate when values change
  useEffect(() => {
    validateForm()
  }, [values, validateForm])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    resetForm,
    validateForm,
  }
}