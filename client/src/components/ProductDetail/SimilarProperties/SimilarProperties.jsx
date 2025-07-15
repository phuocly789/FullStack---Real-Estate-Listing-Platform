import React, { useEffect, useMemo, useState } from 'react';
import styles from './SimilarProperties.module.css';
import PropertyCard from '../../PropertyCard/PropertyCard';
import { useGetPropertiesQuery, useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';

const SimilarProperties = ({ currentId }) => {
    const { data, isLoading, isError, isFetching } = useGetPropertiesQuery({ page: 1, limit: 50 });
    const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [toast, setToast] = useState({ message: '', type: '' });

    const properties = data?.properties;

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

    if (isLoading && !isFetching || isFavoritesLoading) {
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
    const randomThree = useMemo(() => {
        if (!filtered || filtered.length === 0) return [];
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }, [properties]); // Chỉ khi dữ liệu bất động sản thay đổi mới random lại
    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000); // 🕓 Tự động ẩn sau 4 giây

            return () => clearTimeout(timeout); // 🔁 Dọn dẹp timeout khi toast thay đổi
        }
    }, [toast]);

    return (
        <div className={styles.similar}>
            <h3 className={styles.heading}>Bất động sản tương tự</h3>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />
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
                        isFavorite={favoriteIds.has(prop.id)}
                        onToggleFavorite={() => handleToggleFavorite(prop.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimilarProperties;