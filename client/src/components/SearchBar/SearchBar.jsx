import React, { useMemo, useState } from 'react';
import styles from './SearchBar.module.css';
import { useGetPropertiesQuery } from '../../api/apiSlice';

const SearchBar = ({ onSearch, isLoading }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [areaSort, setAreaSort] = useState('');
    const [priceSort, setPriceSort] = useState('');
    const { data, isLoading: isQueryLoading } = useGetPropertiesQuery();

    // Hàm trích xuất tỉnh/thành phố
    const extractProvince = (location) => {
        if (!location || typeof location !== 'string') {
            console.log('Invalid location:', location);
            return 'Unknown';
        }
        const parts = location.split(',').map((part) => part.trim());
        return parts.length > 1 ? parts[parts.length - 1] : location;
    };

    // Rút gọn văn bản
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Tạo danh sách khu vực duy nhất từ properties
    const locations = useMemo(() => {
        return data?.properties
            ? [...new Set(data.properties.map((prop) => extractProvince(prop.location)))]
            : [];
    }, [data]);

    const handleSearch = () => {
        onSearch({ title, location, areaSort, priceSort });
    };

    const handleClearFilters = () => {
        setTitle('');
        setLocation('');
        setAreaSort('');
        setPriceSort('');
        onSearch({ title: '', location: '', areaSort: '', priceSort: '' });
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Tìm kiếm bất động sản</h2>
            <p className={styles.subtitle}>
                Lọc theo tên, khu vực, diện tích hoặc giá cả để tìm bất động sản phù hợp với bạn
            </p>

            <div className={styles.container}>
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    className={styles.input}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isQueryLoading}
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
                >
                    <option value="">Sắp xếp diện tích</option>
                    <option value="asc">Diện tích: Thấp đến cao</option>
                    <option value="desc">Diện tích: Cao đến thấp</option>
                </select>

                <select
                    className={styles.input}
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                >
                    <option value="">Sắp xếp giá</option>
                    <option value="asc">Giá: Thấp đến cao</option>
                    <option value="desc">Giá: Cao đến thấp</option>
                </select>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.searchButton}
                        onClick={handleSearch}
                        disabled={isLoading || isQueryLoading}
                    >
                        {isLoading || isQueryLoading ? (
                            <div className={styles.loaderContainer}>
                                <div className={styles.spinner}></div>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            'Tìm kiếm'
                        )}
                    </button>

                    {(title || location || areaSort || priceSort) && (
                        <button
                            className={styles.clearButton}
                            onClick={handleClearFilters}
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;