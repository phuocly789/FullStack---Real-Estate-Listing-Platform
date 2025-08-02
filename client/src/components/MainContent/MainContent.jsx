import React, { useState } from 'react';
import styles from './MainContent.module.css';
import { Link } from 'react-router-dom';

// Hàm trích xuất tên tỉnh từ location
const extractProvince = (location) => {
    if (!location || typeof location !== 'string') {
        console.log('Invalid location:', location);
        return 'Unknown';
    }
    const parts = location.split(',').map((part) => part.trim());
    return parts.length > 1 ? parts[parts.length - 1] : location;
};

// Hàm rút gọn văn bản
const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const MainContent = ({ properties }) => {
    const [activeTab, setActiveTab] = useState('featured');
    const [tabStartIndex, setTabStartIndex] = useState(0); // Quản lý vị trí bắt đầu của tab

    // Tạo danh sách tỉnh/thành phố dựa vào properties
    const provinces = properties
        ? [...new Set(properties.map((prop) => extractProvince(prop.location)))]
        : [];

    // Giới hạn số lượng tab hiển thị (tối đa 5 tab)
    const maxTabs = 10;
    const tabs = [
        { id: 'featured', label: 'Tin Nổi Bật' },
        ...provinces.slice(tabStartIndex, tabStartIndex + maxTabs).map((province) => ({
            id: province,
            label: province,
        })),
    ];

    // Lọc properties theo tab đang chọn
    const filteredProperties = properties
        ? activeTab === 'featured'
            ? properties
            : properties.filter((prop) => extractProvince(prop.location) === activeTab)
        : [];
    const mainProperty = filteredProperties[0] || {};

    // Hàm điều hướng tab
    const handleNextTabs = () => {
        if (tabStartIndex + maxTabs < provinces.length) {
            setTabStartIndex(tabStartIndex + maxTabs); // Di chuyển một nhóm tab
        } else {
            setTabStartIndex(provinces.length - maxTabs); // Đảm bảo tab cuối hiển thị
        }
    };

    const handlePrevTabs = () => {
        if (tabStartIndex > 0) {
            setTabStartIndex(Math.max(tabStartIndex - maxTabs, 0)); // Di chuyển ngược lại một nhóm
        }
    };

    return (
        <div className={`container ${styles.section}`}>
            <div className="d-flex align-items-center mb-3">
                {/* Nút điều hướng trái */}
                <button
                    className={styles.navButton}
                    onClick={handlePrevTabs}
                    disabled={tabStartIndex === 0}
                >
                    &larr;
                </button>

                {/* Danh sách tab */}
                <ul className={`nav nav-tabs flex-grow-1 ${styles.navTabs}`}>
                    {tabs.map((tab) => (
                        <li className="nav-item" key={tab.id}>
                            <button
                                className={`${styles.navLink} ${activeTab === tab.id ? styles.navLinkActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>


                {/* Nút điều hướng phải */}
                <button
                    className={styles.navButton}
                    onClick={handleNextTabs}
                    disabled={tabStartIndex + maxTabs > provinces.length}
                >
                    &rarr;
                </button>
            </div>

            <div className="row">
                <div className="col-md">
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <div className="col-md-6">
                            <Link to={`/product/${mainProperty.id}`} className={styles.mainArticle}>
                                {mainProperty.images && mainProperty.images.length > 0 ? (
                                    <img
                                        src={mainProperty.images[0]}
                                        alt="House"
                                        className={`${styles.articleImage} img-fluid mb-2`}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/300"
                                        alt="Placeholder"
                                        className={`${styles.articleImage} img-fluid mb-2`}
                                    />
                                )}
                                <h2 className={styles.articleTitle}>
                                    {truncateText(mainProperty.title, 38)} {/* Rút gọn tiêu đề */}
                                </h2>
                                <p className={styles.articleDescription}>
                                    {truncateText(mainProperty.description, 72)} {/* Rút gọn mô tả */}
                                </p>
                                <div className="d-flex justify-content-between">
                                    <p className={styles.articleDescription}>
                                        Type: <i>{mainProperty.type}</i>
                                    </p>
                                    <p className={styles.articleTime}>
                                        {mainProperty.createdat
                                            ? new Date(mainProperty.createdat).toLocaleDateString('vi-VN')
                                            : 'Không có thời gian'}
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-6">
                            <ul className={styles.articleList}>
                                {filteredProperties.length <= 1 ? (
                                    <li className={styles.articleListItem}>
                                        <div className={styles.articleListLink}>
                                            Không có thông tin
                                            <p className={styles.articleDescription}>Không có thông tin mô tả</p>
                                            <p className={styles.articleTime}>Không có thời gian</p>
                                            <hr />
                                        </div>
                                    </li>
                                ) : (
                                    filteredProperties.map((prop) => (
                                        <li key={prop.id} className={styles.articleListItem}>
                                            <Link to={`/product/${prop.id}`} className={styles.articleListLink}>
                                                {truncateText(prop.title, 50)} {/* Rút gọn tiêu đề */}
                                                <p className={styles.articleDescription}>
                                                    {truncateText(prop.description, 60)} {/* Rút gọn mô tả */}
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <p className={styles.articleDescription}>
                                                        Type: <i>{prop.type}</i>
                                                    </p>
                                                    <p className={styles.articleTime}>
                                                        {prop.createdat
                                                            ? new Date(prop.createdat).toLocaleDateString('vi-VN')
                                                            : 'Không có thời gian'}
                                                    </p>
                                                </div>
                                                <hr />
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;