import React, { useEffect, useState } from "react";
import styles from "./Favorite.module.css"
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "../../api/apiSlice";

import PropertyCard from "../PropertyCard/PropertyCard";
import Toast from "../Toast/Toast";

const Favorite = () => {
    const { data: favorites, isLoading, isError } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    //tạo list yêu thích 
    const favoriteIds = new Set(favorites?.map(fav => fav.propertyid) || []);
    //
    const handleToggleFavorite = async (propertyId) => {
        try {
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
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Danh Sách Yêu Thích</h2>
            <p className={styles.subtitle}>Nơi Chứa Đựng Tất Cả Lựa Chọn Của Bạn</p>
            <hr className={styles.hr} />
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />
            {!favorites || favorites.length === 0 ? (
                <div className={styles.empty}>Bạn chưa có bất động sản nào trong danh sách yêu thích.</div>
            ) : (

                <div className={styles.grid}>
                    {favorites.map((fav) => (
                        <PropertyCard
                            key={fav.property.id}
                            id={fav.property.id}
                            title={fav.property.title}
                            price={fav.property.price}
                            area={fav.property.area}
                            location={fav.property.location}
                            image={
                                fav.property.images[0]
                                    ? `${fav.property.images[0]}`
                                    : 'https://via.placeholder.com/300'
                            }
                            imageCount={fav.property.images.length}
                            isFavorite={favoriteIds.has(fav.property.id)}
                            onToggleFavorite={() => handleToggleFavorite(fav.property.id)}
                        />
                    ))}
                </div>
            )
            }
        </div>
    )
}
export default Favorite;