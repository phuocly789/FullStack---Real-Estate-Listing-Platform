import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [areaSort, setAreaSort] = useState('');
    const [priceSort, setPriceSort] = useState('');

    const handleSearch = () => {
        onSearch({ title, location, areaSort, priceSort });
    };
    //

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Tìm kiếm bất động sản</h2>
            <p className={styles.subtitle}>Lọc theo tên, khu vực, diện tích hoặc giá cả để tìm bất động sản phù hợp với bạn</p>
     

            <div className={styles.container}>
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Khu vực..."
                    className={styles.input}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <select className={styles.input} value={areaSort} onChange={(e) => setAreaSort(e.target.value)}>
                    <option value="">Sắp xếp diện tích</option>
                    <option value="asc">Diện tích: Thấp đến cao</option>
                    <option value="desc">Diện tích: Cao đến thấp</option>
                </select>

                <select className={styles.input} value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
                    <option value="">Sắp xếp giá</option>
                    <option value="asc">Giá: Thấp đến cao</option>
                    <option value="desc">Giá: Cao đến thấp</option>
                </select>

                <button className={styles.searchButton} onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
