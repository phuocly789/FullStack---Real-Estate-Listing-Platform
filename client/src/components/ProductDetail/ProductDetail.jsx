import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPropertyQuery, useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../api/apiSlice';
import ContactInfo from './ContactInfo/ContactInfo';
import Description from './Description/Description';
import MapSection from './MapSection/MapSection';
import SimilarProperties from './SimilarProperties/SimilarProperties';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import styles from './ProductDetail.module.css';
import Toast from '../Toast/Toast';

const PropertyDetail = () => {
    const { id } = useParams();
    const { data: property, isLoading, isError } = useGetPropertyQuery(id);
    const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Kiểm tra xem bất động sản hiện tại có trong danh sách yêu thích không
    const isFavorite = favorites?.some(fav => fav.propertyid === parseInt(id));

    const handleToggleFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setToast({ message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích!', type: 'error' })
                return;
            }

            if (isFavorite) {
                await removeFavorite(id).unwrap();
                setToast({ message: 'Xóa khỏi danh sách yêu thích thành công', type: 'success' })
            } else {
                await addFavorite(id).unwrap();
                setToast({ message: 'Thêm vào danh sách yêu thích thành công', type: 'success' })
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setToast({ message: 'Có lỗi xảy ra khi thêm yêu thích: ' + error, type: 'error' })
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            property.images.length === 0 ? 0 : (prev + 1) % property.images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            property.images.length === 0 ? 0 : (prev - 1) % property.images.length
        );
    };

    if (isLoading || isFavoritesLoading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (isError || !property) {
        return <div className="text-center mt-5">Không tìm thấy bất động sản.</div>;
    }
    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000); // 🕓 Tự động ẩn sau 4 giây

            return () => clearTimeout(timeout); // 🔁 Dọn dẹp timeout khi toast thay đổi
        }
    }, [toast]);
    return (
        <div className={styles.container}>
            <div className="row mt-5">
                <div className="col-md-9">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => {
                            setToast({ message: '', type: '' });
                            setIsSuccess(null);
                        }}
                    />
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
                            <button
                                className={`${styles.heartIcon} ${isFavorite ? styles.favoriteActive : ''}`}
                                onClick={handleToggleFavorite}
                            >
                                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        </div>
                        <div className={styles.details}>
                            <div>
                                <p>Diện tích: <i>{property.area} m²</i></p>
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
                       
                    </div>
                </div>
                <div className="col-md-3">
                    <ContactInfo userid={property.userid} propertyid={property.id} />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;