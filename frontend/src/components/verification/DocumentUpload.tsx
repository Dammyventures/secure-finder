import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import Button from '../common/UI/Button'

interface DocumentUploadProps {
  documentType: string
  description: string
  onUpload: (file: File) => void
  onRemove: () => void
  currentFile?: File
  acceptedFormats?: string[]
  maxSize?: number
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  description,
  onUpload,
  onRemove,
  currentFile,
  acceptedFormats = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5 * 1024 * 1024, // 5MB
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0])
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize,
    maxFiles: 1,
    multiple: false,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {currentFile ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-600"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={() => document.getElementById(`file-input-${documentType}`)?.click()}
            variant="outline"
            size="sm"
          >
            Change File
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`text-center cursor-pointer ${
            isDragActive ? 'bg-blue-50' : ''
          }`}
        >
          <input
            id={`file-input-${documentType}`}
            {...getInputProps()}
          />
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {documentType}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <p className="text-sm text-gray-500">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Accepted: {acceptedFormats.join(', ')} • Max: {formatFileSize(maxSize)}
          </p>
        </div>
      )}
    </div>
  )
}

export default DocumentUpload