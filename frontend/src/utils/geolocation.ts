/**
 * Get current user location using browser geolocation API
 */
export const getCurrentLocation = (): Promise<{
  latitude: number
  longitude: number
  accuracy?: number
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        
        reject(new Error(errorMessage))
      },
      options
    )
  })
}

/**
 * Reverse geocode coordinates to address using Nominatim (OpenStreetMap)
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{
  address: string
  city: string
  country: string
  fullAddress: string
}> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch address')
    }
    
    const data = await response.json()
    const address = data.address
    
    return {
      address: address.road || address.suburb || '',
      city: address.city || address.town || address.village || address.county || '',
      country: address.country || '',
      fullAddress: data.display_name || '',
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return {
      address: '',
      city: '',
      country: '',
      fullAddress: '',
    }
  }
}

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

/**
 * Check if location is within radius
 */
export const isWithinRadius = (
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon)
  return distance <= radiusKm
}

/**
 * Get bounding box for coordinates
 */
export const getBoundingBox = (
  latitude: number,
  longitude: number,
  radiusKm: number
): {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
} => {
  const earthRadius = 6371 // km
  const latDegree = radiusKm / earthRadius * (180 / Math.PI)
  const lngDegree = latDegree / Math.cos(latitude * Math.PI / 180)
  
  return {
    minLat: latitude - latDegree,
    maxLat: latitude + latDegree,
    minLng: longitude - lngDegree,
    maxLng: longitude + lngDegree,
  }
}

/**
 * Convert degrees to radians
 */
export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI)
}

/**
 * Calculate bearing between two points
 */
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = toRadians(lat1)
  const φ2 = toRadians(lat2)
  const Δλ = toRadians(lon2 - lon1)
  
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const θ = Math.atan2(y, x)
  
  return (toDegrees(θ) + 360) % 360
}

/**
 * Get midpoint between two coordinates
 */
export const getMidpoint = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { latitude: number; longitude: number } => {
  const φ1 = toRadians(lat1)
  const λ1 = toRadians(lon1)
  const φ2 = toRadians(lat2)
  const λ2 = toRadians(lon2)
  
  const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1)
  const By = Math.cos(φ2) * Math.sin(λ2 - λ1)
  
  const φ3 = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
  )
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx)
  
  return {
    latitude: toDegrees(φ3),
    longitude: toDegrees(λ3),
  }
}

/**
 * Validate coordinates
 */
export const isValidCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

/**
 * Parse coordinates from string
 */
export const parseCoordinates = (coordsString: string): { latitude: number; longitude: number } | null => {
  const regex = /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/
  const match = coordsString.match(regex)
  
  if (match) {
    const latitude = parseFloat(match[1])
    const longitude = parseFloat(match[2])
    
    if (isValidCoordinates(latitude, longitude)) {
      return { latitude, longitude }
    }
  }
  
  return null
}

/**
 * Format coordinates for display
 */
export const formatCoordinates = (latitude: number, longitude: number): string => {
  const latDir = latitude >= 0 ? 'N' : 'S'
  const lngDir = longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lngDir}`
}

/**
 * Get approximate address from coordinates using fallback method
 */
export const getApproximateAddress = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&pretty=1`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch address')
    }
    
    const data = await response.json()
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted
    }
    
    return formatCoordinates(latitude, longitude)
  } catch (error) {
    console.error('Geocoding error:', error)
    return formatCoordinates(latitude, longitude)
  }
}

/**
 * Calculate travel time using Google Maps Distance Matrix API
 */
export const calculateTravelTime = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): Promise<{ duration: string; distance: string } | null> => {
  try {
    // This requires Google Maps API key
    // For production, you would implement this with your API key
    return null
  } catch (error) {
    console.error('Travel time calculation error:', error)
    return null
  }
}