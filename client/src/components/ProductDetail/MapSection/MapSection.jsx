import React from 'react';
import styles from './MapSection.module.css';
import map from '../../../assets/images/map.jpg'; // Placeholder image, replace with actual map image
const MapSection = () => {
    return (
        <div className={styles.map}>
            <h3 className={styles.heading}>Bản đồ</h3>
            <img src={map} alt="Bản đồ" className={styles.mapImage} />
        </div>
    );
};

export default MapSection;