import React, { useEffect, useState } from "react"; // Thêm useEffect
import styles from "./Collection.module.css";
import SearchBar from "../SearchBar/SearchBar";
import {
    useGetPropertiesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
    useGetFavoritesQuery // Import useGetFavoritesQuery
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
    const [toast, setToast] = useState({ message: '', type: '' }); // State cho Toast

    const { data, isLoading, isError } = useGetPropertiesQuery({ page, limit, ...filters }, { refetchOnMountOrArgChange: true });
    // Lấy dữ liệu yêu thích
    const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    // Tạo một Set các ID bất động sản yêu thích để tìm kiếm nhanh
    const favoriteIds = new Set(favorites?.map(fav => fav.propertyid) || []);

    const properties = data?.properties || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const handleSearch = (newFilters) => {
        setPage(1); // reset về trang đầu
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
        setPage(1); // reset về trang đầu
        setCheck(!check);
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

    // Logic xử lý yêu thích giống hệt như PropertyList
    const handleToggleFavorite = async (propertyId) => {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
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
            // Kiểm tra nếu lỗi là từ server, có thể hiển thị thông báo lỗi cụ thể hơn
            const errorMessage = error?.data?.message || 'Có lỗi xảy ra khi thêm/xóa yêu thích.';
            setToast({ message: errorMessage, type: 'error' });
        }
    };

    // useEffect để tự động ẩn toast
    useEffect(() => {
        if (toast.message) {
            const timeout = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 2000); // 🕓 Tự động ẩn sau 2 giây (có thể điều chỉnh)

            return () => clearTimeout(timeout); // 🔁 Dọn dẹp timeout khi component unmount hoặc toast thay đổi
        }
    }, [toast]);

    if (isLoading || isFavoritesLoading) { // Thêm isFavoritesLoading vào điều kiện loading
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (isError || !properties) {
        return <div className="text-center mt-5">Lỗi khi tải dữ liệu bất động sản hoặc danh sách yêu thích.</div>;
    }

    if (properties.length === 0 && !check) { // Kiểm tra nếu không có bất động sản và không có lọc
        return (
            <div className={styles.container}>
                <div className="row">
                    <SearchBar onSearch={handleSearch} />
                    <div className="text-center mt-3">
                        <p>Không có bất động sản nào để hiển thị.</p>
                        <button className={`btn btn-info ${styles.clearFilterBtn}`} onClick={handleClearFilters}>
                            Xóa tất cả bộ lọc để xem các bất động sản khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (properties.length === 0 && check) { // Nếu có lọc nhưng không tìm thấy kết quả
        return (
            <div className={styles.container}>
                <div className="row">
                    <SearchBar onSearch={handleSearch} />
                    <div className="text-center mt-3">
                        <p>Không tìm thấy bất động sản nào phù hợp với bộ lọc của bạn.</p>
                        <button className={`btn btn-danger ${styles.clearFilterBtn}`} onClick={handleClearFilters}>
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="row">
                <SearchBar onSearch={handleSearch} />
                <div className="text-center">
                    {check && (
                        <button className={`btn btn-danger ${styles.check}`} onClick={handleClearFilters}>Xóa lọc</button>
                    )}
                </div>

                {/* Toast component hiển thị thông báo */}
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: '', type: '' })} // Đặt lại toast về trạng thái rỗng khi đóng
                />

                {/* Thay thế PropertyListPage bằng việc render PropertyCard trực tiếp */}
                <div className={styles.grid}> {/* Sử dụng styles.grid từ PropertyList.module.css hoặc tạo mới nếu cần */}
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
                        <button onClick={handlePrevPage} className="btn btn-outline-primary mx-2" disabled={page === 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
                            </svg>
                        </button>
                    )}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                className={`btn mx-1 ${pageNumber === page ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    {totalPages > 1 && (
                        <button onClick={handleNextPage} className="btn btn-outline-primary mx-2" disabled={properties.length < limit || page === totalPages}> {/* Thêm điều kiện disabled */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
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