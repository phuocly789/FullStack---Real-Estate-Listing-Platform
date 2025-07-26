import React, { useEffect, useState, useRef } from "react";
import styles from "./Collection.module.css";
import SearchBar from "../SearchBar/SearchBar";
import {
    useGetPropertiesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
    useGetFavoritesQuery
} from "../../api/apiSlice";
import Toast from "../Toast/Toast";
import PropertyCard from "../PropertyCard/PropertyCard";

const Collection = () => {
    const [check, setCheck] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 8;
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        areaSort: '',
        priceSort: ''
    });
    const [toast, setToast] = useState({ message: '', type: '' });
    const listRef = useRef(null);

    const { data, isLoading, isError } = useGetPropertiesQuery({ page, limit, ...filters }, { refetchOnMountOrArgChange: true });
    const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const favoriteIds = new Set(favorites?.map(fav => fav.propertyid) || []);
    const properties = data?.properties || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const handleSearch = (newFilters) => {
        setPage(1);
        setFilters(newFilters);
        setCheck(!check);
    };

    const handleClearFilters = () => {
        setFilters({
            title: '',
            location: '',
            areaSort: '',
            priceSort: ''
        });
        setPage(1);
        setCheck(!check);
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

    const handleToggleFavorite = async (propertyId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setToast({ message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích!', type: 'error' });
                return;
            }

            if (favoriteIds.has(propertyId)) {
                await removeFavorite(propertyId).unwrap();
                setToast({ message: 'Xóa khỏi danh sách yêu thích thành công', type: 'success' });
            } else {
                await addFavorite(propertyId).unwrap();
                setToast({ message: 'Thêm vào danh sách yêu thích thành công', type: 'success' });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi thêm/xóa yêu thích.';
            setToast({ message: errorMessage, type: 'error' });
        }
    };

    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [toast]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [page, filters]);

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const ellipsis = <span key={`ellipsis-${pageNumbers.length}`} className={styles.ellipsis}>...</span>;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`btn mx-1 ${i === page ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPage(i)}
                        disabled={isLoading}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            pageNumbers.push(
                <button
                    key={1}
                    className={`btn mx-1 ${1 === page ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setPage(1)}
                    disabled={isLoading}
                >
                    1
                </button>
            );

            let startPage = Math.max(2, page - 2);
            let endPage = Math.min(totalPages - 1, page + 2);

            if (endPage - startPage + 2 < maxPagesToShow - 1) {
                if (page < totalPages / 2) {
                    endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
                } else {
                    startPage = Math.max(2, endPage - maxPagesToShow + 3);
                }
            }

            if (startPage > 2) {
                pageNumbers.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`btn mx-1 ${i === page ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPage(i)}
                        disabled={isLoading}
                    >
                        {i}
                    </button>
                );
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
            }

            pageNumbers.push(
                <button
                    key={totalPages}
                    className={`btn mx-1 ${totalPages === page ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setPage(totalPages)}
                    disabled={isLoading}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    if (isLoading || isFavoritesLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError || !properties) {
        return (
            <div className={styles.errorContainer}>
                <p>Lỗi: Không thể tải dữ liệu bất động sản hoặc danh sách yêu thích.</p>
                <button className={`btn btn-primary ${styles.retryBtn}`} onClick={() => window.location.reload()}>
                    Thử lại
                </button>
            </div>
        );
    }

    if (properties.length === 0 && !check) {
        return (
            <div className={styles.container}>
                <div className="row">
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    <div className={styles.emptyContainer}>
                        <p>Không có bất động sản nào để hiển thị.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (properties.length === 0 && check) {
        return (
            <div className={styles.container}>
                <div className="row">
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    <div className={styles.emptyContainer}>
                        <p>Không tìm thấy bất động sản nào phù hợp với bộ lọc của bạn.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="row">
                <div ref={listRef} />
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: '', type: '' })}
                />
                <div className={styles.grid}>
                    {properties.map((prop) => (
                        <PropertyCard
                            key={prop.id}
                            id={prop.id}
                            title={prop.title}
                            price={prop.price}
                            area={prop.area}
                            createdat={prop.createdat}
                            location={prop.location}
                            image={
                                prop.images && prop.images[0]
                                    ? `${prop.images[0]}`
                                    : 'https://via.placeholder.com/300'
                            }
                            imageCount={prop.images ? prop.images.length : 0}
                            isFavorite={favoriteIds.has(prop.id)}
                            onToggleFavorite={() => handleToggleFavorite(prop.id)}
                        />
                    ))}
                </div>
                <div className="d-flex justify-content-center my-4">
                    {totalPages > 1 && (
                        <button
                            onClick={handlePrevPage}
                            className="btn btn-outline-primary mx-2"
                            disabled={page === 1 || isLoading}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#1f1f1f"
                            >
                                <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
                            </svg>
                        </button>
                    )}
                    {renderPagination()}
                    {totalPages > 1 && (
                        <button
                            onClick={handleNextPage}
                            className="btn btn-outline-primary mx-2"
                            disabled={properties.length < limit || page === totalPages || isLoading}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#1f1f1f"
                            >
                                <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;