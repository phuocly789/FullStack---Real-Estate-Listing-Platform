import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import styles from './PropertyList.module.css';
import { useGetPropertiesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoritesQuery } from '../api/apiSlice';
import Toast from '../components/Toast/Toast';

const PropertyList = ({ properties, isLoading, isError }) => {
    const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [toast, setToast] = useState({ message: '', type: '' });

    // Create a Set of favorite property IDs for quick lookup
    const favoriteIds = new Set(favorites?.map(fav => fav.propertyid) || []);

    const handleToggleFavorite = async (propertyId) => {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            const token = localStorage.getItem('token');
            if (!token) {
                setToast({ message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích!', type: 'error' })
                return;
            }

            if (favoriteIds.has(propertyId)) {
                await removeFavorite(propertyId).unwrap();
                setToast({ message: 'Xóa khỏi danh sách yêu thích thành công', type: 'success' })
            } else {
                await addFavorite(propertyId).unwrap();
                setToast({ message: 'Thêm vào danh sách yêu thích thành công', type: 'success' })
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setToast({ message: 'Có lỗi xảy ra khi thêm yêu thích: ' + error, type: 'error' })
        }
    };

    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000); // 🕓 Tự động ẩn sau 4 giây

            return () => clearTimeout(timeout); // 🔁 Dọn dẹp timeout khi toast thay đổi
        }
    }, [toast]);

    if (isLoading || isFavoritesLoading) {
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
            <div className="d-flex mb-4">
                <h2 className={styles.heading}>Bất động sản dành cho bạn</h2>
                <a href='/collection' className={`btn btn-outline-primary ms-auto text-black ${styles.more}`}>
                    Xem Thêm
                </a>
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />
            <div className={styles.grid}>
                {properties.slice(0, 8).map((prop) => (
                    <PropertyCard
                        key={prop.id}
                        id={prop.id}
                        title={prop.title}
                        price={prop.price}
                        area={prop.area}
                        createdat={prop.createdat}
                        location={prop.location}
                        image={
                            prop.images[0]
                                ? `${prop.images[0]}`
                                : 'https://via.placeholder.com/300'
                        }
                        imageCount={prop.images.length}
                        isFavorite={favoriteIds.has(prop.id)}
                        onToggleFavorite={() => handleToggleFavorite(prop.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default PropertyList;