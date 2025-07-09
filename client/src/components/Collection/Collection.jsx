import React, { useState } from "react";
import styles from "./Collection.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useGetPropertiesQuery } from "../../api/apiSlice";
import PropertyListPage from "./PropertyListPage/PropertyListPage";
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

    const { data, isLoading, isError } = useGetPropertiesQuery({ page, limit, ...filters }, { refetchOnMountOrArgChange: true });
    //
    const properties = data?.properties || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);
    //
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

    //
    const handleNextPage = () => setPage((prev) => prev + 1);

    const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);
    //
    if (isLoading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (isError || !properties) {
        return <div className="text-center mt-5">Lỗi khi tải dữ liệu bất động sản.</div>;
    }
    //
    console.log(properties);

    const mainProperty = properties?.[0] || {};
    return (
        <div className={styles.container}>
            <div className="row">
                <SearchBar onSearch={handleSearch} />
                <div className="text-center">
                    {check && (
                        <button className={`btn btn-danger ${styles.check}`} onClick={handleClearFilters}>Xóa lọc</button>
                    )}
                </div>
                <PropertyListPage
                    properties={properties}
                    isLoading={isLoading}
                    isError={isError}
                />
                <div className="d-flex justify-content-center my-4">
                    {totalPages > 1 && (
                        <button onClick={handlePrevPage} className="btn btn-outline-primary mx-2" disabled={page === 1}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#1f1f1f"
                            >
                                <path
                                    d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"
                                />
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
                        <button onClick={handleNextPage} className="btn btn-outline-primary mx-2" disabled={properties.length < limit}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px" viewBox="0 -960 960 960"
                                width="24px" fill="#1f1f1f"
                            >
                                <path
                                    d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

};
export default Collection;