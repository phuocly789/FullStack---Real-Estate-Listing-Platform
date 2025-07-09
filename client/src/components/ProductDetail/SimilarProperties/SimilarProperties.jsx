import React from 'react';
import styles from './SimilarProperties.module.css';
import properties from '../../../data/properties';
import PropertyCard from '../../PropertyCard/PropertyCard';
import { useGetPropertiesQuery, useGetPropertyCountByUserQuery } from '../../../api/apiSlice';
const SimilarProperties = ({ currentId }) => {
    const { data: properties, isLoading, isError, isFetching } = useGetPropertiesQuery({ page: 1, limit: 50 });


    if (isLoading && !isFetching) {
        return <div className={styles.loading}>Loading......</div>;
    }

    if (isError) {
        return <div className={styles.error}>Lỗi khi tải dữ liệu bất động sản!</div>;
    }
    if (!properties || properties.length === 0) {
        return <div className={styles.empty}>Không có dữ liệu để hiển thị.</div>;
    }

    // Lọc ra các property không trùng với currentId
    const filtered = properties.filter((prop) => prop.id !== parseInt(currentId));
    // Trộn ngẫu nhiên
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    //
    const randomThree = shuffled.slice(0, 3);
    //
    return (
        <div className={styles.similar}>
            <h3 className={styles.heading}>Bất động sản tương tự</h3>
            <div className={styles.grid}>
                {randomThree.map((prop) => (
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
        </div>
    );
};

export default SimilarProperties;