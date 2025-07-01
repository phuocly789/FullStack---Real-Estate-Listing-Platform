import React from 'react';
import styles from './FeaturedArticle.module.css';
import img from '../../../assets/images/bg2.png';

const FeaturedArticle = () => (
    <article className={styles.featured}>
        <img src={img} alt="Featured" className={styles.image} />
        <div className={styles.overlay}>
            <p className={styles.date}>01/07/2025 07:48 · Tin tức</p>
            <h2 className={styles.title}>Thị Trường Bất Động Sản Sẽ Phát Triển Minh Bạch Với Trung Tâm Giao Dịch Bất Động Sản</h2>
            <p className={styles.description}>
                Tại hội thảo Ngày Hội Môi giới Bất động sản Việt Nam với chủ đề "Fly up - VARS vững tâm, vươn tầm mới", nhiều thông tin đáng chú ý về thị trường đã được các diễn giả chia sẻ...
            </p>
        </div>
    </article>
);

export default FeaturedArticle;