import React from 'react';
import styles from './AdSection.module.css';
import background from '../../../assets/images/bg2.png';

const AdSection = () => {
    return (
        <div className={styles.adSection}>
            <div className={styles.adCard}>
                <img src={background} alt="Ad 1" className={styles.adImage} />
                <div className={styles.adContent}>
                    <h5 className={styles.adTitle}>Đổi liền suất Top đầu</h5>
                    <p className={styles.adText}>Voucher chỉ 10.000đ</p>
                    <button className={`${styles.adButton} ${styles.adDanger}`}>Đi ngay</button>
                </div>
            </div>

            <div className={styles.adCard}>
                <img src={background} alt="Ad 2" className={styles.adImage} />
                <div className={styles.adContent}>
                    <h5 className={styles.adTitle}>Miễn phí đăng tin cho thuê nhà</h5>
                    <p className={styles.adText}>Đăng tin ngay</p>
                    <button className={`${styles.adButton} ${styles.adSuccess}`}>Đi ngay</button>
                </div>
            </div>
        </div>
    );
};

export default AdSection;
