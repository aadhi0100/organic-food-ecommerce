'use client'

import { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number; address: string } | undefined
}

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState(initialLocation || { lat: 28.6139, lng: 77.2090, address: '' })
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const address = await reverseGeocode(latitude, longitude)
          const newLocation = { lat: latitude, lng: longitude, address }
          setLocation(newLocation)
          onLocationSelect(newLocation)
          setLoading(false)
        },
        () => {
          setLoading(false)
          alert('Unable to get location')
        }
      )
    }
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <Navigation className="w-4 h-4" />
        {loading ? 'Getting Location...' : 'Use Current Location'}
      </button>

      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {location.address && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium">Delivery Location</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{location.address}</p>
          </div>
        </div>
      )}
    </div>
  )
}
