import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "./Collection.module.css";
import {
    useGetPropertiesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
    useGetFavoritesQuery,
} from "../../api/apiSlice";
import Toast from "../Toast/Toast";
import PropertyCard from "../PropertyCard/PropertyCard";

const Collection = () => {
    const [check, setCheck] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 8;
    const [filters, setFilters] = useState({
        title: "",
        location: "",
        areaSort: "",
        priceSort: "",
    });
    const [toast, setToast] = useState({ message: "", type: "" });
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [areaSort, setAreaSort] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [addFavorite] = useAddFavoriteMutation();
    const [isSearching, setIsSearching] = useState(false);
    const listRef = useRef(null);

    const { data: propertiesFull, isLoading: isLoadingPropertiesFull, isFetching: isFetchingPropertiesFull } = useGetPropertiesQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const { data, isLoading: isLoadingProperties, isFetching: isFetchingProperties, isError } = useGetPropertiesQuery(
        { page, limit, ...filters },
        { refetchOnMountOrArgChange: true }
    );
    const { data: favorites, isLoading: isLoadingFavorites, isFetching: isFetchingFavorites } = useGetFavoritesQuery();

    const isAnyLoading = isLoadingPropertiesFull || isLoadingProperties || isLoadingFavorites || isSearching || isFetchingPropertiesFull || isFetchingProperties || isFetchingFavorites;

    const favoriteIds = new Set(favorites?.map((fav) => fav.propertyid) || []);
    const properties = data?.properties || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Hàm trích xuất tỉnh/thành phố
    const extractProvince = (location) => {
        if (!location || typeof location !== "string") {
            console.log("Invalid location:", location);
            return "Unknown";
        }
        const parts = location.split(",").map((part) => part.trim());
        return parts.length > 1 ? parts[parts.length - 1] : location;
    };

    // Rút gọn văn bản
    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Tạo danh sách khu vực duy nhất từ properties
    const locations = useMemo(() => {
        return propertiesFull?.properties
            ? [...new Set(propertiesFull.properties.map((prop) => extractProvince(prop.location)))]
            : [];
    }, [propertiesFull]);

    const handleSearch = () => {
        setIsSearching(true);
        setPage(1);
        setFilters({ title, location, areaSort, priceSort });
        setCheck(!check);
    };

    const handleClearFilters = () => {
        setTitle("");
        setLocation("");
        setAreaSort("");
        setPriceSort("");
        setFilters({ title: "", location: "", areaSort: "", priceSort: "" });
        setPage(1);
        setCheck(!check);
        setIsSearching(true);
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

    const handleToggleFavorite = async (propertyId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setToast({ message: "Vui lòng đăng nhập để thêm vào danh sách yêu thích!", type: "error" });
                return;
            }

            if (favoriteIds.has(propertyId)) {
                await removeFavorite(propertyId).unwrap();
                setToast({ message: "Xóa khỏi danh sách yêu thích thành công", type: "success" });
            } else {
                await addFavorite(propertyId).unwrap();
                setToast({ message: "Thêm vào danh sách yêu thích thành công", type: "success" });
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            const errorMessage = error?.data?.message || "Có lỗi xảy ra khi thêm/xóa yêu thích.";
            setToast({ message: errorMessage, type: "error" });
        }
    };

    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: "", type: "" });
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [toast]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [page, filters]);

    useEffect(() => {
        if (!isFetchingProperties && !isFetchingPropertiesFull && !isFetchingFavorites) {
            setIsSearching(false);
        }
    }, [isFetchingProperties, isFetchingPropertiesFull, isFetchingFavorites]);

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const ellipsis = (
            <span key={`ellipsis-${pageNumbers.length}`} className={styles.ellipsis}>
                ...
            </span>
        );

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`btn mx-1 ${i === page ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPage(i)}
                        disabled={isAnyLoading}
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
                    disabled={isAnyLoading}
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
                        disabled={isAnyLoading}
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
                    disabled={isAnyLoading}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className={styles.container}>
            {isAnyLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            )}
            <div className="row">
                <div ref={listRef} />
                <div className={styles.wrapper}>
                    <h2 className={styles.title}>Tìm kiếm bất động sản</h2>
                    <p className={styles.subtitle}>
                        Lọc theo tên, khu vực, diện tích hoặc giá cả để tìm bất động sản phù hợp với bạn
                    </p>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Tìm theo tên..."
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isAnyLoading}
                        />
                        <select
                            className={styles.input}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={isAnyLoading}
                        >
                            <option value="">Chọn khu vực</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {truncateText(loc, 20)}
                                </option>
                            ))}
                        </select>
                        <select
                            className={styles.input}
                            value={areaSort}
                            onChange={(e) => setAreaSort(e.target.value)}
                            disabled={isAnyLoading}
                        >
                            <option value="">Sắp xếp diện tích</option>
                            <option value="asc">Diện tích: Thấp đến cao</option>
                            <option value="desc">Diện tích: Cao đến thấp</option>
                        </select>
                        <select
                            className={styles.input}
                            value={priceSort}
                            onChange={(e) => setPriceSort(e.target.value)}
                            disabled={isAnyLoading}
                        >
                            <option value="">Sắp xếp giá</option>
                            <option value="asc">Giá: Thấp đến cao</option>
                            <option value="desc">Giá: Cao đến thấp</option>
                        </select>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.searchButton}
                                onClick={handleSearch}
                                disabled={isAnyLoading}
                            >
                                {isAnyLoading ? "Đang tải..." : "Tìm kiếm"}
                            </button>
                            {(title || location || areaSort || priceSort) && (
                                <button
                                    className={styles.clearButton}
                                    onClick={handleClearFilters}
                                    disabled={isAnyLoading}
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {isError || !properties ? (
                    <div className={styles.errorContainer}>
                        <p>Lỗi: Không thể tải dữ liệu bất động sản hoặc danh sách yêu thích.</p>
                        <button
                            className={`btn btn-primary ${styles.retryBtn}`}
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                    </div>
                ) : properties.length === 0 && !check ? (
                    <div className={styles.emptyContainer}>
                        <p>Không có bất động sản nào để hiển thị.</p>
                    </div>
                ) : properties.length === 0 && check ? (
                    <div className={styles.emptyContainer}>
                        <p>Không tìm thấy bất động sản nào phù hợp với bộ lọc của bạn.</p>
                    </div>
                ) : (
                    <>
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast({ message: "", type: "" })}
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
                                            : "https://via.placeholder.com/300"
                                    }
                                    imageCount={prop.images ? prop.images.length : 0}
                                    isFavorite={favoriteIds.has(prop.id)}
                                    onToggleFavorite={() => handleToggleFavorite(prop.id)}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center my-4">
                                {totalPages > 1 && (
                                    <button
                                        onClick={handlePrevPage}
                                        className="btn btn-outline-primary mx-2"
                                        disabled={page === 1 || isAnyLoading}
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
                                        disabled={properties.length < limit || page === totalPages || isAnyLoading}
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Collection;