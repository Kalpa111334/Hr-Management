import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

// Fix for default marker icons in Leaflet
L.Icon.Default.mergeOptions({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png'
})

interface MapProps {
  center: [number, number]
  markers: Array<{
    position: [number, number]
    title: string
  }>
  zoom: number
  showPath?: boolean
}

export function Map({ center, markers, zoom, showPath = false }: MapProps) {
  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>{marker.title}</Popup>
          </Marker>
        ))}
        {showPath && markers.length > 1 && (
          <Polyline
            positions={markers.map(marker => marker.position)}
            color="blue"
          />
        )}
      </MapContainer>
    </div>
  )
}
