import React from 'react';
import styles from './LocationCard.module.css';

const LocationCard = ({ city, count, image, large }) => {
    return (
        <div className={`${styles.card} ${large ? styles.large : ''}`} style={{ backgroundImage: `url(${image})` }}>
            <div className={styles.overlay}>
                <h3>{city}</h3>
                <p>{count.toLocaleString()} tin đăng</p>
            </div>
        </div>
    );
};

export default LocationCard;
