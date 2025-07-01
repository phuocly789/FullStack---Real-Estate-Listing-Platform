import React from 'react';
import styles from './SimilarProperties.module.css';
import properties from '../../../data/properties';
import PropertyCard from '../../PropertyCard/PropertyCard';
const SimilarProperties = ({currentId}) => {
    
    const similar = properties.filter((prop) => prop.id !== currentId).slice(0, 3);
     // Giả sử id 1 là sản phẩm hiện tại

    return (
        <div className={styles.similar}>
            <h3 className={styles.heading}>Bất động sản tương tự</h3>
            <div className={styles.grid}>
                {similar.map((prop) => (
                    <PropertyCard key={prop.id} {...prop} />
                ))}
            </div>
        </div>
    );
};

export default SimilarProperties;