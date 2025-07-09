import React from 'react';
import LocationCard from '../LocationCard/LocationCard';
import styles from './LocationGrid.module.css';
import hcm from '../../assets/images/hcm.jpg';
import hanoi from '../../assets/images/hanoi.jpg';
import danang from '../../assets/images/danang.jpg';
import binhduong from '../../assets/images/binhduong.jpg';
import dongnai from '../../assets/images/dongnai.jpg';

const locations = [
    {
        city: 'TP. Hồ Chí Minh',
        count: 68284,
        image: hcm,
        large: true,
    },
    {
        city: 'Hà Nội',
        count: 60934,
        image: hanoi,
    },
    {
        city: 'Đà Nẵng',
        count: 10796,
        image: danang,
    },
    {
        city: 'Bình Dương',
        count: 8822,
        image:binhduong,
    },
    {
        city: 'Đồng Nai',
        count: 4075,
        image: dongnai,
    },
];

const LocationGrid = () => {
    return (
        <div className={styles.wrapper}>
            <h2>Bất động sản theo địa điểm</h2>
            <div className={styles.grid}>
                {locations.map((loc, index) => (
                    <LocationCard
                        key={index}
                        city={loc.city}
                        count={loc.count}
                        image={loc.image}
                        large={loc.large}
                    />
                ))}
            </div>
        </div>
    );
};

export default LocationGrid;
