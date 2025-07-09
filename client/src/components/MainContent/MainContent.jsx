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

const MainContent = ({ properties, isLoading, isError }) => {
    const [activeTab, setActiveTab] = useState('featured');
    //tạo danh sách location dựa vào properties 
    const provinces = properties
        ? [...new Set(properties.map((prop) => extractProvince(prop.location)))]
        : [];
    //tạo danh sách tab
    const tabs = [
        { id: 'featured', label: 'Tin Nổi Bật' },
        ...provinces.map((province) => ({ id: province, label: province })),
    ];
    //lọc theo tabs
    const filteredProperties = properties
        ? activeTab === 'featured'
            ? properties // Hiển thị tất cả cho "Tin Nổi Bật"
            : properties.filter((prop) => extractProvince(prop.location) === activeTab)
        : [];
    const mainProperty = filteredProperties[0] || {};

    if (isLoading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }

    if (isError || !properties) {
        return <div className="text-center mt-5">Lỗi khi tải dữ liệu bất động sản.</div>;
    }

    return (
        <div className={`container-fluid ${styles.section}`}>
         
            <ul className="nav nav-tabs mb-3">
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
                                <h2 className={styles.articleTitle}>{mainProperty.title}</h2>
                                <p className={styles.articleDescription}>{mainProperty.description}</p>
                                <div className="d-flex justify-content-between">
                                    <p className={styles.articleDescription}>Type: <i>{mainProperty.type}</i></p>
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
                                                {prop.title}
                                                <p className={styles.articleDescription}>{prop.description}</p>
                                                <div className="d-flex justify-content-between">
                                                    <p className={styles.articleDescription}>Type: <i>{prop.type}</i></p>
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
        </div >
    );
};

export default MainContent;
