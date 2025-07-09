import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPropertyQuery } from '../../api/apiSlice';
import ContactInfo from './ContactInfo/ContactInfo';
import Description from './Description/Description';
import MapSection from './MapSection/MapSection';
import SimilarProperties from './SimilarProperties/SimilarProperties';
import { FaRegHeart } from 'react-icons/fa';
import styles from '../ProductDetail/ProductDetail.module.css';

const PropertyDetail = () => {
    const { id } = useParams();
    const { data: property, isLoading, isError } = useGetPropertyQuery(id);
    console.log('Property data:', property);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            property.images.length === 0 ? 0 : (prev + 1) % property.images.length
        );
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            property.images.length === 0 ? 0 : (prev - 1) % property.images.length
        );
    }
    if (isLoading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (isError || !property) {
        return <div className="text-center mt-5">Không tìm thấy bất động sản.</div>;
    }

    return (
        <div className={styles.container}>
            <div className="row">
                <div className="col-md-9">
                    <div className={styles.card}>
                        <div className={styles.gallery}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={property.images[currentImageIndex] || 'https://via.placeholder.com/300'}
                                    alt={property.title}
                                    className={styles.image}
                                />
                                <button className={styles.prevButton} onClick={prevImage}>❮</button>
                                <button className={styles.nextButton} onClick={nextImage}>❯</button>
                            </div>
                            <div className={styles.imageInfo}>
                                <span>{currentImageIndex + 1}/{property.images.length} ảnh</span>

                            </div>
                        </div>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{property.title}</h1>
                            <FaRegHeart className={styles.heartIcon} />
                        </div>
                        <div className={styles.details}>
                            <div>
                                <p>Diện tích: <i>{property.area} m²</i></p>
                                {/* <p>User ID: {property.userid} </p> */}
                                <p>Phòng ngủ: <i>{property.bedrooms || 'Không xác định'}</i></p>
                                <p>Giá: <i>{property.price ? `${property.price.toLocaleString()} VND` : 'Không xác định'}</i></p>
                                <p>Vị trí: <i>{property.location}</i></p>
                            </div>
                            
                            <span className={styles.priceTag}>+1% Giá tăng trong 1 tháng qua</span>
                        </div>
                        <div className={styles.grid}>
                            <Description description={property.description} />
                            <MapSection latitude={property.latitude} longitude={property.longitude} />
                        </div>
                        <SimilarProperties currentId={id} />
                        <div className={styles.historyButton}>
                            <button>Xem lịch sử giá</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <ContactInfo userid={property.userid} />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;