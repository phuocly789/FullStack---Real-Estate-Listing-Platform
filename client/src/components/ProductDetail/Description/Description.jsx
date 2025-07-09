import React from 'react';
import styles from './Description.module.css';

const Description = ({ description }) => {
    if (!description || description.trim() === '') {
        return (
            <div className={styles.description}>
                <h3 className={styles.heading}>Mô tả</h3>
                <p className={styles.empty}><i>Không có mô tả nào cho bất động sản này.</i></p>
            </div>
        );
    }

    return (
        <div className={styles.description}>
            <h3 className={styles.heading}>Mô tả</h3>
            <p className={styles.text}><i>{description}</i></p>
        </div>
    );
};

export default Description;
