import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Nhập CSS của Leaflet
import L from 'leaflet'; // Nhập Leaflet để tùy chỉnh marker
import styles from './MapSection.module.css'; // Tùy chọn: CSS module cho style

// Sửa lỗi icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
const MapSection = ({ latitude, longitude }) => {
    if (!latitude || !longitude) {
        return <div className={styles.noMap}>Không có thông tin vị trí</div>
    }

    const position = [latitude, longitude];

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Vị trí bất động sản: {latitude},{longitude}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
export default MapSection