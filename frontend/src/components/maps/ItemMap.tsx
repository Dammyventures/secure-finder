import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation, Target } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import Button from '../common/UI/Button'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ItemLocation {
  id: string
  lat: number
  lng: number
  title: string
  type: 'lost' | 'found'
  category: string
  status: string
  date: string
  address?: string
}

interface ItemMapProps {
  items: ItemLocation[]
  center?: [number, number]
  zoom?: number
  onItemClick?: (itemId: string) => void
  showFilters?: boolean
  radius?: number // in kilometers
}

const ItemMap: React.FC<ItemMapProps> = ({
  items,
  center = [51.505, -0.09],
  zoom = 13,
  onItemClick,
  showFilters = true,
  radius,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const [filteredType, setFilteredType] = useState<'all' | 'lost' | 'found'>('all')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showUserLocation, setShowUserLocation] = useState(false)

  // Create custom icons
  const createIcon = (type: 'lost' | 'found') => {
    return new L.Icon({
      iconUrl: type === 'lost' 
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ]
        setUserLocation(location)
        setShowUserLocation(true)
        
        if (mapRef.current) {
          mapRef.current.setView(location, 15)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location')
      }
    )
  }

  const filteredItems = items.filter(item => {
    if (filteredType === 'all') return true
    return item.type === filteredType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      electronics: '📱',
      documents: '📄',
      jewelry: '💎',
      bags: '🎒',
      clothing: '👕',
      keys: '🔑',
      pets: '🐾',
      other: '📦',
    }
    return icons[category] || '📍'
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {showFilters && (
            <>
              <button
                onClick={() => setFilteredType('all')}
                className={`px-3 py-1.5 text-sm rounded-full ${
                  filteredType === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilteredType('lost')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                  filteredType === 'lost'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Lost Items
              </button>
              <button
                onClick={() => setFilteredType('found')}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center ${
                  filteredType === 'found'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Found Items
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getUserLocation}
            className="flex items-center"
          >
            <Navigation size={16} className="mr-2" />
            My Location
          </Button>
          {userLocation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUserLocation(!showUserLocation)}
              className="flex items-center"
            >
              <Target size={16} className="mr-2" />
              {showUserLocation ? 'Hide Me' : 'Show Me'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center px-3 py-2 bg-red-50 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium">
            Lost: {items.filter(i => i.type === 'lost').length}
          </span>
        </div>
        <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium">
            Found: {items.filter(i => i.type === 'found').length}
          </span>
        </div>
        <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium">
            Showing: {filteredItems.length} items
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-300 shadow-sm">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Show radius circle if specified */}
          {radius && userLocation && (
            <Circle
              center={userLocation}
              radius={radius * 1000} // Convert km to meters
              pathOptions={{
                fillColor: '#3b82f6',
                color: '#1d4ed8',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}

          {/* Show user location */}
          {showUserLocation && userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="font-medium">Your Location</div>
              </Popup>
            </Marker>
          )}

          {/* Item markers */}
          {filteredItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createIcon(item.type)}
              eventHandlers={{
                click: () => onItemClick?.(item.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.type === 'lost' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(item.date)}
                    </div>
                    {item.address && (
                      <div className="text-sm text-gray-600 flex items-start">
                        <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                        <span>{item.address}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <button
                        onClick={() => onItemClick?.(item.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm">Lost Items</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Found Items</span>
            </div>
            {showUserLocation && userLocation && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Your Location</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> Click on markers to view item details. Use the filter buttons to show specific types of items.</p>
      </div>
    </div>
  )
}

export default ItemMap