import React from 'react';
import styles from './SlideBar.module.css';
import { NavLink } from 'react-router-dom';
import { FaUser, FaHome } from 'react-icons/fa';

const SlideBar = () => {
    return (
        <div className={styles.sidebar}>
            <NavLink
                to="/profile/overview"
                className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                end
            >
                <FaHome className={styles.icon} />
                <span>Tổng quan</span>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                }
            >
                <FaUser className={styles.icon} />
                <span>Hồ sơ</span>
            </NavLink>
        </div>
    );
};

export default SlideBar;
