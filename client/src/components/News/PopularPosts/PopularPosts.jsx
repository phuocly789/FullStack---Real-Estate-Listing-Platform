import React from 'react';
import styles from './PopularPosts.module.css';

const posts = [
    'Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất Tháng 6/2025',
    '3 Phân Khúc Dẫn Dắt Thị Trường Bất Động Sản Quý 1/2025'
];

const PopularPosts = () => (
    <aside className={styles.sidebar}>
        <h3 className={styles.heading}>Bài viết được xem nhiều nhất</h3>
        <ol className={styles.list}>
            {posts.map((p, i) => (
                <li key={i} className={styles.item}>{p}</li>
            ))}
        </ol>
    </aside>
);

export default PopularPosts;