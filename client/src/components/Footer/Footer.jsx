import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
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
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#">Tin tức</a></li>
                        <li><a href="#">BDS HCM</a></li>
                        <li><a href="#">Liên hệ</a></li>
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
