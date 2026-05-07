import React, { useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Search, MapPin, Navigation, X, Target } from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import LocationPicker from './LocationPicker'

interface GeoSearchProps {
  onLocationSelect: (location: {
    lat: number
    lng: number
    address: string
    radius?: number
  }) => void
  onRadiusChange?: (radius: number) => void
  initialLocation?: {
    lat: number
    lng: number
    address: string
  }
  showRadiusControl?: boolean
  className?: string
}

const GeoSearch: React.FC<GeoSearchProps> = ({
  onLocationSelect,
  onRadiusChange,
  initialLocation,
  showRadiusControl = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(initialLocation || null)
  const [radius, setRadius] = useState<number>(10) // in kilometers
  const [showMap, setShowMap] = useState<boolean>(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentGeoSearch')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save to recent searches
  const saveToRecentSearches = (query: string) => {
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query),
    ].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem('recentGeoSearch', JSON.stringify(updatedSearches))
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      )
      const data = await response.json()
      setSearchResults(data)
      saveToRecentSearches(query)
    } catch (error) {
      console.error('Error searching location:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchLocation(value)
      } else {
        setSearchResults([])
      }
    }, 500)
  }

  const handleLocationSelect = (location: any) => {
    const selected = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      address: location.display_name,
    }
    
    setSelectedLocation(selected)
    setSearchQuery(location.display_name)
    setSearchResults([])
    setShowMap(false)
    
    onLocationSelect({
      ...selected,
      radius: showRadiusControl ? radius : undefined,
    })
  }

  const handleMapLocationSelect = (location: {
    lat: number
    lng: number
    address: string
  }) => {
    setSelectedLocation(location)
    setSearchQuery(location.address)
    setShowMap(false)
    
    onLocationSelect({
      ...location,
      radius: showRadiusControl ? radius : undefined,
    })
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsSearching(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await response.json()
          
          const location = {
            lat: latitude,
            lng: longitude,
            address: data.display_name || 'Current Location',
          }
          
          setSelectedLocation(location)
          setSearchQuery(location.address)
          
          onLocationSelect({
            ...location,
            radius: showRadiusControl ? radius : undefined,
          })
        } catch (error) {
          console.error('Error reverse geocoding:', error)
          const location = {
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          }
          setSelectedLocation(location)
          setSearchQuery(location.address)
          
          onLocationSelect({
            ...location,
            radius: showRadiusControl ? radius : undefined,
          })
        } finally {
          setIsSearching(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location. Please enable location services.')
        setIsSearching(false)
      }
    )
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedLocation(null)
    setShowMap(false)
    onLocationSelect({
      lat: 0,
      lng: 0,
      address: '',
      radius: 0,
    })
  }

  const radiusOptions = [1, 5, 10, 25, 50, 100]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Input
            placeholder="Search for a city, address, or area..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            disabled={isSearching}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={20} className="text-gray-400" />
          </div>
        </div>
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          isLoading={isSearching}
          disabled={isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Navigation size={20} />
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(result)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start">
                <MapPin size={16} className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">{result.display_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.lat}, {result.lon}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && searchResults.length === 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Recent Searches:</div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchChange(search)}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                <Search size={12} className="mr-1.5" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Radius Control */}
      {showRadiusControl && selectedLocation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Search Radius:</span>
            <span className="text-sm text-gray-600">{radius} km</span>
          </div>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={(e) => {
                const newRadius = parseInt(e.target.value)
                setRadius(newRadius)
                onRadiusChange?.(newRadius)
                onLocationSelect({
                  ...selectedLocation,
                  radius: newRadius,
                })
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between">
              {radiusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setRadius(option)
                    onRadiusChange?.(option)
                    onLocationSelect({
                      ...selectedLocation,
                      radius: option,
                    })
                  }}
                  className={`text-xs px-2 py-1 rounded ${
                    radius === option
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {option} km
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Toggle */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center"
        >
          <MapPin size={16} className="mr-2" />
          {showMap ? 'Hide Map' : 'Show on Map'}
        </Button>
        
        {selectedLocation && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Selected:</span> {selectedLocation.address}
          </div>
        )}
      </div>

      {/* Map Container */}
      {showMap && (
        <div className="border rounded-lg overflow-hidden">
          <LocationPicker
            onLocationSelect={handleMapLocationSelect}
            initialLocation={selectedLocation || undefined}
            zoom={selectedLocation ? 14 : 10}
            className="p-4"
          />
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Target size={20} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Search Area</h4>
              <p className="text-blue-800">{selectedLocation.address}</p>
              <div className="flex items-center mt-2 text-sm text-blue-700">
                <span className="mr-4">
                  Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
                {showRadiusControl && (
                  <span>
                    Radius: {radius} km
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>💡 <strong>How to use:</strong> Type an address, use current location, or click "Show on Map" to select a location manually.</p>
      </div>
    </div>
  )
}

export default GeoSearch