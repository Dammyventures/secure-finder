import React, { useState } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MapPin, Calendar, Image, Plus, X } from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import Select from '../common/UI/Select'
import LocationPicker from '../maps/LocationPicker'

// Define the form data interface first
interface ItemFormData {
  title: string;
  description: string;
  category: string;
  dateLostFound: Date | string;
  reward?: number;
}

// Define the extended form data for the component
interface ExtendedItemFormData extends ItemFormData {
  identifyingFeatures?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
}

interface ItemFormProps {
  type: 'lost' | 'found'
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<ExtendedItemFormData>
}

// Create the schema with proper type safety
const itemSchema = yup.object({
  title: yup.string().required('Title is required').min(3).max(100),
  description: yup.string().required('Description is required').min(10).max(1000),
  category: yup.string().required('Category is required'),
  dateLostFound: yup
    .mixed()
    .required('Date is required')
    .test('is-date', 'Invalid date', (value) => {
      return value instanceof Date || !isNaN(Date.parse(value as string));
    })
    .transform((value) => new Date(value as string)),
  reward: yup.number().min(0).max(10000).optional().nullable(),
}).required();

const ItemForm: React.FC<ItemFormProps> = ({
  type,
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [identifyingFeatures, setIdentifyingFeatures] = useState<string[]>(initialData?.identifyingFeatures || [])
  const [newFeature, setNewFeature] = useState('')
  const [location, setLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(initialData?.location || null)

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'documents', label: 'Documents' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'bags', label: 'Bags & Wallets' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'keys', label: 'Keys' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ItemFormData>({
    resolver: yupResolver(itemSchema as any),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      dateLostFound: new Date().toISOString().slice(0, 16),
      reward: undefined,
      ...initialData,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index])
    
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const addFeature = () => {
    if (newFeature.trim() && !identifyingFeatures.includes(newFeature.trim())) {
      setIdentifyingFeatures([...identifyingFeatures, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...identifyingFeatures]
    newFeatures.splice(index, 1)
    setIdentifyingFeatures(newFeatures)
  }

  const handleFormSubmit: SubmitHandler<ItemFormData> = async (data) => {
    const formData = {
      ...data,
      location: location
        ? {
            latitude: location.lat,
            longitude: location.lng,
            address: location.address,
          }
        : null,
      images,
      identifyingFeatures,
      itemType: type,
    }
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder={`e.g., ${type === 'lost' ? 'Lost iPhone 14 Pro Max' : 'Found Wallet with ID'}`}
          />
        </div>

        <div>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Category"
                options={categories}
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the item in detail..."
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location {type === 'lost' ? 'Lost' : 'Found'}
        </label>
        <LocationPicker
          onLocationSelect={setLocation}
          initialLocation={location}
        />
        {!location && (
          <p className="text-sm text-red-500 mt-2">
            Please select a location on the map
          </p>
        )}
        {location && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2" />
              {location.address}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="relative">
          <Input
            label={`Date ${type === 'lost' ? 'Lost' : 'Found'}`}
            type="datetime-local"
            {...register('dateLostFound')}
            error={errors.dateLostFound?.message}
          />
          <div className="absolute right-3 top-9 text-gray-400">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (Max 5)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label htmlFor="images" className="cursor-pointer">
            <Image size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPEG, PNG, GIF • Max 5MB each
            </p>
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Identifying Features
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newFeature}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeature(e.target.value)}
            placeholder="e.g., Red case, Cracked screen, Serial number"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addFeature}
            className="whitespace-nowrap"
          >
            <Plus size={20} />
          </Button>
        </div>
        {identifyingFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {identifyingFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {type === 'lost' && (
        <div>
          <div className="relative">
            <Input
              label="Reward (optional)"
              type="number"
              {...register('reward')}
              error={errors.reward?.message}
              placeholder="0"
              min="0"
              step="10"
            />
            <div className="absolute right-3 top-9 text-gray-400">
              <span>$</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!location}
        >
          {type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </Button>
      </div>
    </form>
  )
}

export default ItemForm