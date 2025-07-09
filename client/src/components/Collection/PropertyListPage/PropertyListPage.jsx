import React, { useState, useEffect } from 'react';
import styles from './PropertyListPage.module.css';
import PropertyCard from '../../PropertyCard/PropertyCard';

const PropertyListPage = ({ properties, isLoading, isError }) => {

    if (isLoading) {
        return <div className={styles.loading}>Đang tải...</div>;
    }

    if (isError) {
        return <div className={styles.error}>Lỗi khi tải dữ liệu bất động sản!</div>;
    }

    if (properties.length === 0) {
        return <div className={styles.empty}>Không có bất động sản nào để hiển thị.</div>;
    }

    return (
        <section className={styles.section}>
            
           <hr className={styles.hr}/>
            <div className={styles.grid}>
                {properties.slice(0, 8).map((prop) => (
                    <PropertyCard
                        key={prop.id}
                        id={prop.id}
                        title={prop.title}
                        price={prop.price}
                        area={prop.area}
                        location={prop.location}
                        image={
                            prop.images[0]
                                ? `${prop.images[0]}`
                                : 'https://via.placeholder.com/300'
                        }
                        imageCount={prop.images.length}
                    />
                ))}
            </div>
        </section>
    );
};

export default PropertyListPage;