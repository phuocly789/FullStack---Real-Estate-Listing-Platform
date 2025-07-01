import React from 'react';
import styles from './Description.module.css';

const Description = () => {
    return (
        <div className={styles.description}>
            <h3 className={styles.heading}>Mô tả</h3>
            <p>Căn hộ chung cư với thiết kế hiện đại tại The Felix Thuận An, đầy đủ nội thất, view đẹp, phù hợp cho gia đình trẻ.</p>
        </div>
    );
};

export default Description;