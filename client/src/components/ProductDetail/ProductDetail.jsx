import React, { use } from 'react';
import styles from './ProductDetail.module.css';
import ContactInfo from './ContactInfo/ContactInfo';
import Description from './Description/Description';
import MapSection from './MapSection/MapSection';
import SimilarProperties from './SimilarProperties/SimilarProperties';
import img1 from '../../assets/images/hcm.jpg'; // Placeholder image, replace with actual image
import { useParams } from 'react-router-dom';
import properties from '../../data/properties';
import { FaRegHeart } from 'react-icons/fa';
const PropertyDetail = () => {
    const { id } = useParams();
    const property = properties.find((item) => item.id === Number(id));
    if (!property) return <p className="text-center mt-5">Không tìm thấy sản phẩm.</p>;

    return (
        <div className={styles.container}>
            <div className="row">
                <div className="col-md-9">
                    <div className={styles.card}>
                        <div className={styles.gallery}>
                            <img src={property.image} alt="Hình ảnh Bất Động Sản" className={styles.image} />
                            <div className={styles.imageInfo}>
                                <span>{property.imageCount}/19 ảnh</span>
                                <span className={styles.viewAll}>Xem tất cả ảnh</span>
                            </div>
                        </div>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{property.title}</h1>
                            <FaRegHeart className={styles.heartIcon} />
                        </div>

                        <div className={styles.details}>
                            <div>
                                <p>Diện tích: {property.area}</p>
                                <p>Phòng ngủ: {property.bedrooms}</p>
                                <p>Giá: {property.pricePerUnit}</p>
                            </div>
                            <span className={styles.priceTag}>+1% Giá tăng trong 1 tháng qua</span>
                        </div>
                        <p className={styles.location}>{property.location}</p>
                        <div className={styles.grid}>

                            <Description />
                            <MapSection />
                        </div>
                        <SimilarProperties currentId={id} />
                        <div className={styles.historyButton}>
                            <button>Xem lịch sử giá</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <ContactInfo contact={property.contact} />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;