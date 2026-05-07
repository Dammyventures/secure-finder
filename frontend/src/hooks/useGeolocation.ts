import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FILE_CONFIG } from '../utils/constants'

interface UseUploadOptions {
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  onUploadComplete?: (files: File[]) => void
  onUploadError?: (error: string) => void
}

interface UseUploadReturn {
  files: File[]
  previews: string[]
  isUploading: boolean
  progress: number
  errors: string[]
  handleFileSelect: (selectedFiles: FileList | File[]) => void
  handleFileRemove: (index: number) => void
  handleClearFiles: () => void
  uploadFiles: () => Promise<File[]>
  validateFiles: () => boolean
}

export const useUpload = (options: UseUploadOptions = {}): UseUploadReturn => {
  const {
    maxFiles = FILE_CONFIG.MAX_FILES_PER_UPLOAD,
    maxSize = FILE_CONFIG.MAX_FILE_SIZE,
    allowedTypes = [...FILE_CONFIG.ALLOWED_IMAGE_TYPES, ...FILE_CONFIG.ALLOWED_DOCUMENT_TYPES],
    onUploadComplete,
    onUploadError,
  } = options

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  // Validate a single file
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }

      // Check file size
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds ${maxSize / (1024 * 1024)}MB limit`
      }

      // Check file count
      if (files.length >= maxFiles) {
        return `Maximum ${maxFiles} files allowed`
      }

      return null
    },
    [allowedTypes, maxSize, maxFiles, files.length]
  )

  // Handle file selection
  const handleFileSelect = useCallback(
    (selectedFiles: FileList | File[]) => {
      const fileArray = Array.from(selectedFiles)
      const newErrors: string[] = []
      const validFiles: File[] = []
      const validPreviews: string[] = []

      fileArray.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(error)
          toast.error(error)
        } else {
          validFiles.push(file)
          
          // Create preview for images
          if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file)
            validPreviews.push(previewUrl)
          } else {
            validPreviews.push('') // Empty string for non-image files
          }
        }
      })

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors])
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles))
        setPreviews((prev) => [...prev, ...validPreviews].slice(0, maxFiles))
      }
    },
    [validateFile, maxFiles]
  )

  // Handle file removal
  const handleFileRemove = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index, 1)
        return newFiles
      })

      setPreviews((prev) => {
        const newPreviews = [...prev]
        // Revoke object URL to prevent memory leaks
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index])
        }
        newPreviews.splice(index, 1)
        return newPreviews
      })

      setErrors((prev) => prev.filter((_, i) => i !== index))
    },
    []
  )

  // Clear all files
  const handleClearFiles = useCallback(() => {
    // Revoke all object URLs
    previews.forEach((preview) => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    })

    setFiles([])
    setPreviews([])
    setErrors([])
    setProgress(0)
  }, [previews])

  // Validate all files
  const validateFiles = useCallback((): boolean => {
    const newErrors: string[] = []

    files.forEach((file, index) => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(`File ${index + 1}: ${error}`)
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }, [files, validateFile])

  // Simulate file upload (replace with actual API call)
  const uploadFiles = useCallback(async (): Promise<File[]> => {
    if (files.length === 0) {
      throw new Error('No files to upload')
    }

    if (!validateFiles()) {
      throw new Error('Files failed validation')
    }

    setIsUploading(true)
    setProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setProgress(i)
      }

      // Simulate successful upload
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(100)

      toast.success(`Successfully uploaded ${files.length} file(s)`)
      
      if (onUploadComplete) {
        onUploadComplete(files)
      }

      return files
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      toast.error(errorMessage)
      
      if (onUploadError) {
        onUploadError(errorMessage)
      }
      
      throw error
    } finally {
      setIsUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [files, validateFiles, onUploadComplete, onUploadError])

  // Cleanup object URLs on unmount
  useState(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  })

  return {
    files,
    previews,
    isUploading,
    progress,
    errors,
    handleFileSelect,
    handleFileRemove,
    handleClearFiles,
    uploadFiles,
    validateFiles,
  }
}