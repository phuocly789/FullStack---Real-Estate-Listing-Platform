import React from 'react';
import styles from './SlideBar.module.css';
import { FaUser, FaHome } from 'react-icons/fa';

const SlideBar = ({ setActiveTab, activeTab }) => {
    return (
        <div className={styles.sidebar}>
            <button
                className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''
                    }`}
                onClick={() => setActiveTab('overview')}
            >
                <FaHome className={styles.icon} />
                <span>Tổng quan</span>
            </button>

            <button
                className={`${styles.navItem} ${activeTab === 'personal' ? styles.active : ''
                    }`}
                onClick={() => setActiveTab('personal')}
            >
                <FaUser className={styles.icon} />
                <span>Hồ sơ</span>
            </button>
            <button
                className={`${styles.navItem} ${activeTab === 'personal' ? styles.active : ''
                    }`}
                onClick={() => setActiveTab('personal')}
            >
                <FaUser className={styles.icon} />
                <span>Hồ sơ</span>
            </button>
        </div>
    );
};

export default SlideBar;