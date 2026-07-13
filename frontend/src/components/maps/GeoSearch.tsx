import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Target } from 'lucide-react';

interface GeoSearchProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    radius?: number;
  }) => void;
  onRadiusChange?: (radius: number) => void;
  initialLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  showRadiusControl?: boolean;
  className?: string;
}

const GeoSearch: React.FC<GeoSearchProps> = ({
  onLocationSelect,
  onRadiusChange,
  initialLocation,
  showRadiusControl = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(
    initialLocation?.address || ''
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(initialLocation || null);
  const [radius, setRadius] = useState<number>(10);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentGeoSearch');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveToRecent = (query: string) => {
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem('recentGeoSearch', JSON.stringify(updated));
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5&addressdetails=1&countrycodes=ng`
      );
      const data = await res.json();
      setSearchResults(data);
      saveToRecent(query);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) searchLocation(value);
      else setSearchResults([]);
    }, 500);
  };

  const handleResultClick = (result: any) => {
    const loc = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    setSelectedLocation(loc);
    setSearchQuery(loc.address);
    setSearchResults([]);
    onLocationSelect({ ...loc, radius: showRadiusControl ? radius : undefined });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const loc = {
            lat: latitude,
            lng: longitude,
            address: data.display_name || 'Current Location',
          };
          setSelectedLocation(loc);
          setSearchQuery(loc.address);
          onLocationSelect({ ...loc, radius: showRadiusControl ? radius : undefined });
        } catch {
          const loc = {
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          };
          setSelectedLocation(loc);
          setSearchQuery(loc.address);
          onLocationSelect({ ...loc, radius: showRadiusControl ? radius : undefined });
        } finally {
          setIsSearching(false);
        }
      },
      (err) => {
        console.error(err);
        alert('Unable to get location. Please enable location services.');
        setIsSearching(false);
      }
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLocation(null);
    onLocationSelect({ lat: 0, lng: 0, address: '', radius: 0 });
  };

  const radiusOptions = [1, 5, 10, 25, 50, 100];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search city, address, or area in Nigeria..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isSearching}
            className="w-full px-4 py-2 pl-10 pr-20 bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl text-[#F4FDFF] placeholder-[#F4FDFF]/30 focus:outline-none focus:ring-2 focus:ring-[#F4FDFF]/20"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-[#F4FDFF]/30 hover:text-[#F4FDFF]"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={getCurrentLocation}
            disabled={isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#F4FDFF]/10 rounded-lg hover:bg-[#F4FDFF]/20 transition-colors disabled:opacity-50"
          >
            <Navigation size={18} className="text-[#F4FDFF]" />
          </button>
        </div>

        {/* Results dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-[#1C448E] border border-[#F4FDFF]/15 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-4 py-3 hover:bg-[#F4FDFF]/5 border-b border-[#F4FDFF]/10 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#F4FDFF]/40 mt-0.5" />
                  <div>
                    <div className="text-[#F4FDFF] text-sm">{result.display_name}</div>
                    <div className="text-[#F4FDFF]/40 text-xs">
                      {result.lat}, {result.lon}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && searchResults.length === 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-[#F4FDFF]/40 mr-1">Recent:</span>
          {recentSearches.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSearchChange(s)}
              className="text-xs px-3 py-1 bg-[#F4FDFF]/10 rounded-full text-[#F4FDFF]/60 hover:bg-[#F4FDFF]/20 hover:text-[#F4FDFF] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Radius Control */}
      {showRadiusControl && selectedLocation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#F4FDFF]/60">Radius: {radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={radius}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRadius(val);
              onRadiusChange?.(val);
              if (selectedLocation) {
                onLocationSelect({ ...selectedLocation, radius: val });
              }
            }}
            className="w-full h-1 bg-[#F4FDFF]/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between">
            {radiusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setRadius(opt);
                  onRadiusChange?.(opt);
                  if (selectedLocation) {
                    onLocationSelect({ ...selectedLocation, radius: opt });
                  }
                }}
                className={`text-xs px-2 py-0.5 rounded ${
                  radius === opt
                    ? 'bg-[#F4FDFF]/20 text-[#F4FDFF]'
                    : 'text-[#F4FDFF]/40 hover:text-[#F4FDFF]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected location info */}
      {selectedLocation && (
        <div className="bg-[#F4FDFF]/5 border border-[#F4FDFF]/15 rounded-xl p-3 flex items-start gap-3">
          <Target size={18} className="text-[#F4FDFF]/40 mt-0.5" />
          <div>
            <div className="text-sm text-[#F4FDFF]/80">{selectedLocation.address}</div>
            <div className="text-xs text-[#F4FDFF]/40">
              {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoSearch;