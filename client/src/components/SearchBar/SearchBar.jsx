import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = () => {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.tabs}>
                <button>Nhà đất bán</button>
                <button>Nhà đất cho thuê</button>
                <button>Dự án</button>
            </div>
            <div className={styles.filters}>
                <select><option>Toàn quốc</option></select>
                <select><option>Loại nhà đất</option></select>
                <select><option>Mức giá</option></select>
                <select><option>Diện tích</option></select>
                <button className={styles.searchButton}>Tìm kiếm</button>
            </div>
        </div>
    );
};

export default SearchBar;
