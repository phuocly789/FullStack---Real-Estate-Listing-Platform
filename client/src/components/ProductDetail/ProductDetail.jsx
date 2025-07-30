import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPropertyQuery, useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../api/apiSlice';
import ContactInfo from './ContactInfo/ContactInfo';
import MapSection from './MapSection/MapSection';
import SimilarProperties from './SimilarProperties/SimilarProperties';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import styles from './ProductDetail.module.css';
import Toast from '../Toast/Toast';

// Hàm rút gọn văn bản
const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const PropertyDetail = () => {
    const { id } = useParams();
    const { data: property, isLoading, isError } = useGetPropertyQuery(id);
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Kiểm tra token và favorites
    const token = localStorage.getItem('token');
    const {
        data: favorites,
        isLoading: isFavoritesLoading,
        isError: isFavoritesError,
        refetch: refetchFavorites,
    } = useGetFavoritesQuery(undefined, {
        skip: !token,
    });

    // useEffect cho toast
    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [toast]);

    // Cuộn lên đầu trang khi id thay đổi
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Hàm xử lý yêu thích
    const handleToggleFavorite = async () => {
        try {
            if (!token) {
                setToast({ message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích!', type: 'error' });
                return;
            }
            const isFavorite = favorites?.some(fav => String(fav.propertyid) === String(id));
            if (isFavorite) {
                await removeFavorite(id).unwrap();
                setToast({ message: 'Xóa khỏi danh sách yêu thích thành công', type: 'success' });
            } else {
                await addFavorite(id).unwrap();
                setToast({ message: 'Thêm vào danh sách yêu thích thành công', type: 'success' });
            }
            await refetchFavorites();
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setToast({ message: 'Có lỗi xảy ra khi thêm/xóa yêu thích.', type: 'error' });
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            property?.images?.length === 0 ? 0 : (prev + 1) % property.images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            property?.images?.length === 0 ? 0 : (prev - 1) % property.images.length
        );
    };

    // Kiểm tra trạng thái loading hoặc error
    const isAnyLoading = isLoading || isFavoritesLoading;
    if (isAnyLoading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError || isFavoritesError || !property) {
        return (
            <div className={styles.errorContainer}>
                <p>Lỗi: Không thể tải dữ liệu bất động sản hoặc danh sách yêu thích.</p>
                <button className={`btn btn-primary ${styles.retryBtn}`} onClick={() => window.location.reload()}>
                    Thử lại
                </button>
            </div>
        );
    }

    const isFavorite = favorites?.some(fav => String(fav.propertyid) === String(id));

    return (
        <div className={styles.container}>
            <div className="row mt-5">
                <div className="col-md-9">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: '', type: '' })}
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
                                <span>{currentImageIndex + 1}/{property.images.length || 0} ảnh</span>
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
                                <p className={styles.detailText}>Diện tích: <i>{truncateText(property.area?.toString(), 20)} m²</i></p>
                                <p className={styles.detailText}>Phòng ngủ: <i>{property.bedrooms ? truncateText(property.bedrooms.toString(), 20) : 'Không xác định'}</i></p>
                                <p className={styles.detailText}>Giá: <i>{property.price ? truncateText(`${property.price.toLocaleString()} VND`, 30) : 'Không xác định'}</i></p>
                                <p className={styles.detailText}>Vị trí: <i>{property.location}</i></p>
                            </div>
                            <span className={styles.priceTag}>{truncateText('+1% Giá tăng trong 1 tháng qua', 30)}</span>
                        </div>
                        <div className={styles.grid}>
                            {(!property.description || property.description.trim() === '') ? (
                                <div className={styles.description}>
                                    <h3 className={styles.heading}>Mô tả</h3>
                                    <p className={styles.empty}><i>Không có mô tả nào cho bất động sản này.</i></p>
                                </div>
                            ) : (
                                <div className={styles.description}>
                                    <h3 className={styles.heading}>Mô tả</h3>
                                    <p className={styles.text}><i>{property.description}</i></p>
                                </div>
                            )}
                            <MapSection key={id} latitude={property.latitude} longitude={property.longitude} />
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