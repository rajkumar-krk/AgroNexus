import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink } from 'lucide-react';

// ── Fix default marker icon path for bundlers ──
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = L.divIcon({
  className: 'custom-truck-marker',
  html: `
    <div style="
      width: 42px; height: 42px;
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 14px rgba(59,130,246,0.5);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 18px;
    ">🚚</div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -24],
});

// Component that auto-pans map when marker moves
function MapAutoCenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [position, map]);

  return null;
}

interface LiveGPSMapProps {
  lat: number;
  lon: number;
  coordHistory?: [number, number][];
  height?: string;
  className?: string;
}

export function LiveGPSMap({ lat, lon, coordHistory = [], height = '400px', className = '' }: LiveGPSMapProps) {
  const position: [number, number] = useMemo(() => [lat, lon], [lat, lon]);
  const hasValidPosition = lat !== 0 && lon !== 0;

  // Default center (India) if no valid GPS
  const defaultCenter: [number, number] = [17.385, 78.4867]; // Hyderabad
  const center = hasValidPosition ? position : defaultCenter;

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={hasValidPosition ? 15 : 5}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {hasValidPosition && (
          <>
            <MapAutoCenter position={position} />

            {/* Route polyline */}
            {coordHistory.length > 1 && (
              <Polyline
                positions={coordHistory}
                pathOptions={{
                  color: '#3B82F6',
                  weight: 4,
                  opacity: 0.7,
                  dashArray: '8, 8',
                }}
              />
            )}

            {/* Current position marker */}
            <Marker position={position} icon={truckIcon}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 0' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>📍 Current Position</p>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>
                    {lat.toFixed(6)}, {lon.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Google Maps Button */}
      {hasValidPosition && (
        <button
          onClick={openInGoogleMaps}
          className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 text-sm font-bold text-blue-600 hover:bg-blue-50 hover:shadow-xl transition-all"
        >
          <ExternalLink size={14} />
          Open in Google Maps
        </button>
      )}

      {/* Coordinates HUD */}
      {hasValidPosition && (
        <div className="absolute top-4 left-4 z-[1000] px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-border/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {!hasValidPosition && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-center text-white">
            <p className="text-lg font-bold mb-1">📡 Waiting for GPS Signal</p>
            <p className="text-sm opacity-75">No coordinates received from sensor yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
