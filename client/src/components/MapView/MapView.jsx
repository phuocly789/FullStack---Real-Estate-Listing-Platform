import React from 'react';

const MapView = ({ location }) => {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=14&size=400x300&key=YOUR_GOOGLE_MAPS_API_KEY`;

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold">Vị trí trên bản đồ</h3>
            <img src={mapUrl} alt="Map" className="w-full h-75 object-cover rounded" />
        </div>
    );
};

export default MapView;