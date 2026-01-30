import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Users } from 'lucide-react';
import type { TFunction } from 'i18next';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import type { CafecitoEvent } from '../types/cafecito';

interface CafecitoMapViewProps {
  presencialCafecitos: CafecitoEvent[];
  cafecitoCoordinates: Record<string, [number, number]>;
  userLocation: [number, number] | null;
  getCardTitle: (c: CafecitoEvent) => string;
  getCardDescription: (c: CafecitoEvent) => string;
  getCardLocation: (c: CafecitoEvent) => string | undefined;
  onSelectCafecito: (c: CafecitoEvent) => void;
  t: TFunction;
}

export default function CafecitoMapView({
  presencialCafecitos,
  cafecitoCoordinates,
  userLocation,
  getCardTitle,
  getCardDescription,
  getCardLocation,
  onSelectCafecito,
  t,
}: CafecitoMapViewProps) {
  let mapCenter: [number, number] = userLocation || [4.711, -74.072];
  const availableCoords = presencialCafecitos
    .map((c) => cafecitoCoordinates[c.id])
    .filter((c): c is [number, number] => c !== undefined);

  if (availableCoords.length > 0) {
    const avgLat = availableCoords.reduce((sum, [lat]) => sum + lat, 0) / availableCoords.length;
    const avgLng = availableCoords.reduce((sum, [, lng]) => sum + lng, 0) / availableCoords.length;
    mapCenter = userLocation ?? [avgLat, avgLng];
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={userLocation ? 12 : 11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {presencialCafecitos.map((cafecito) => {
        const coords = cafecitoCoordinates[cafecito.id] ?? [4.711, -74.072];
        return (
          <Marker key={cafecito.id} position={coords}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h4 className="font-bold text-sm mb-1">{getCardTitle(cafecito)}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {getCardDescription(cafecito).substring(0, 100)}...
                </p>
                {(getCardLocation(cafecito) || cafecito.location) && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {getCardLocation(cafecito) || cafecito.location}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Users className="w-3 h-3 shrink-0" />
                  <span>
                    {cafecito.participants}/{cafecito.maxParticipants} {t('cafecito.participants')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCafecito(cafecito)}
                  className="mt-2 text-xs text-[#e74865] hover:underline font-semibold"
                >
                  {t('cafecito.viewDetails')}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>
            <div className="p-2">
              <p className="text-sm font-semibold">{t('cafecito.yourLocation')}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
