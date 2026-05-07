import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation, Target } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import Button from '../common/UI/Button'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Location {
  lat: number
  lng: number
  address: string
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  initialLocation?: Location | null
  zoom?: number
  className?: string
}

// Custom component to handle map instance
const MapController = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap()
  
  useEffect(() => {
    setMap(map)
  }, [map, setMap])
  
  return null
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  zoom = 13,
  className = '',
}) => {
  const [location, setLocation] = useState<Location>(
    initialLocation || {
      lat: 51.505,
      lng: -0.09,
      address: 'London, UK',
    }
  )
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [map, setMap] = useState<L.Map | null>(null)

  // Update parent when location changes
  useEffect(() => {
    if (location) {
      onLocationSelect(location)
    }
  }, [location, onLocationSelect])

  // Set initial location
  useEffect(() => {
    if (initialLocation && map) {
      setLocation(initialLocation)
      map.setView([initialLocation.lat, initialLocation.lng], zoom)
    }
  }, [initialLocation, map, zoom])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await response.json()
          
          const newLocation: Location = {
            lat: latitude,
            lng: longitude,
            address: data.display_name || 'Current Location',
          }
          
          setLocation(newLocation)
          
          if (map) {
            map.setView([latitude, longitude], 15)
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error)
          const newLocation: Location = {
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          }
          setLocation(newLocation)
        } finally {
          setIsGeolocating(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location. Please enable location services.')
        setIsGeolocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      )
      const data = await response.json()

      if (data.length > 0) {
        const result = data[0]
        const newLocation: Location = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
        }
        setLocation(newLocation)
        
        if (map) {
          map.setView([newLocation.lat, newLocation.lng], 15)
        }
      }
    } catch (error) {
      console.error('Error searching location:', error)
    }
  }

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng
        
        try {
          // Reverse geocode on click
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await response.json()
          
          const newLocation: Location = {
            lat,
            lng,
            address: data.display_name || 'Selected Location',
          }
          
          setLocation(newLocation)
        } catch (error) {
          console.error('Error reverse geocoding:', error)
          const newLocation: Location = {
            lat,
            lng,
            address: 'Selected Location',
          }
          setLocation(newLocation)
        }
      },
    })
    return null
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={location.address}
            onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchLocation(location.address)
              }
            }}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          isLoading={isGeolocating}
          disabled={isGeolocating}
        >
          <Navigation size={20} />
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative h-96 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController setMap={setMap} />
          <MapEvents />
          <Marker position={[location.lat, location.lng]} icon={customIcon}>
            <Popup>{location.address}</Popup>
          </Marker>
        </MapContainer>

        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm">
          <div className="flex items-center text-sm text-gray-700">
            <Target size={16} className="mr-2" />
            <span>Click on the map to select a location</span>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <MapPin className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Selected Location</h4>
            <p className="text-gray-700">{location.address}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="mr-4">
                Lat: <span className="font-mono">{location.lat.toFixed(6)}</span>
              </span>
              <span>
                Lng: <span className="font-mono">{location.lng.toFixed(6)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          ⚠️ <span className="font-medium">Note:</span> Location accuracy depends on the selected point. 
          For best results, zoom in and click precisely on the location.
        </p>
      </div>
    </div>
  )
}

export default LocationPicker