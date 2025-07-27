import React from 'react';
import { useGetProfileQuery } from '../../api/apiSlice';
import styles from './Footer.module.css';

// Danh sách liên kết công khai
const Tabs = [
    { name: 'Trang Chủ', link: '/' },
    { name: 'Bất Động Sản', link: '/collection' },
];

// Danh sách liên kết quản trị
const TabsAdmin = [
    { name: 'Dashboard', link: '/admin' },
    { name: 'Properties', link: '/admin_properties' },
    { name: 'Users', link: '/admin_users' },
    { name: 'Contacts', link: '/admin_contacts' },
];

const Footer = () => {
    const { data: user, isError } = useGetProfileQuery(undefined, {
        skip: !localStorage.getItem('token'),
    });

    // Xử lý lỗi token không hợp lệ
    if (isError && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.reload();
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h5>Về chúng tôi</h5>
                    <p>Chuyên trang đăng tin mua bán, cho thuê bất động sản hàng đầu Việt Nam.</p>
                </div>
                <div className={styles.column}>
                    <h5>Liên kết nhanh</h5>
                    <ul>
                        {user?.role === 'ADMIN' ? (
                            TabsAdmin.map((tab) => (
                                <li key={tab.link}>
                                    <a href={tab.link}>{tab.name}</a>
                                </li>
                            ))
                        ) : (
                            Tabs.map((tab) => (
                                <li key={tab.link}>
                                    <a href={tab.link}>{tab.name}</a>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className={styles.column}>
                    <h5>Liên hệ</h5>
                    <p>Email: hotro@batdongsan.vn</p>
                    <p>Hotline: 1900 123 456</p>
                    <p>Địa chỉ: 123 Đường ABC, Q.1, TP.HCM</p>
                </div>
            </div>
            <div className={styles.bottomBar}>
                © {new Date().getFullYear()} Bất Động Sản Việt. Edit By LMP.
            </div>
        </footer>
    );
};

export default Footer;