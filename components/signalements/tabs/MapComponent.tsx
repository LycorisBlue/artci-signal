import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './leaflet.css'; // Assurez-vous d'importer le CSS de Leaflet

// Fix pour les icônes Leaflet dans Next.js
// eslint-disable-next-line react-hooks/rules-of-hooks


interface MapComponentProps {
    latitude: number;
    longitude: number;
    title?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, title }) => {
    useEffect(() => {
        // Only execute this on the client
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/images/marker-icon-2x.png',
            iconUrl: '/images/marker-icon.png',
            shadowUrl: '/images/marker-shadow.png',
        });
    }, []);
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            {/* Google Maps tile layer */}
            <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution="Google Maps"
            />

            {/* Marker at the signalement location */}
            <Marker position={[latitude, longitude]}>
                {title && (
                    <Popup>
                        {title}
                    </Popup>
                )}
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;