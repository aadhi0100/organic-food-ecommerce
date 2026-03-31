'use client'

import { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number; address: string } | undefined
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const { t } = useLanguage()
  const [location, setLocation] = useState(initialLocation || { lat: 28.6139, lng: 77.209, address: '' })
  const [loading, setLoading] = useState(false)

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const data = await response.json()
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  const getCurrentLocation = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      setLoading(false)
      return
    }

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
      },
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={getCurrentLocation}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
      >
        <Navigation className="h-4 w-4" />
        {loading ? t('gettingLocation') : t('useCurrentLocation')}
      </button>

      <div className="overflow-hidden rounded-lg border">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {location.address && (
        <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <MapPin className="mt-0.5 h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium">{t('deliveryLocation')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{location.address}</p>
          </div>
        </div>
      )}
    </div>
  )
}
