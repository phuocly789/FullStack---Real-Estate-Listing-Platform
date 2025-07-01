import React from 'react';
import styles from './ArticleList.module.css';

const articles = [
    {
        date: '30/06/2025 20:21',
        title: 'Giải Thưởng Bất Động Sản Việt Nam PropertyGuru Lần Thứ 11...'
    },
    {
        date: '30/06/2025 16:01',
        title: 'Mayhomes Tỏa Sáng Tại VARS Awards 2025...'
    },
    {
        date: '30/06/2025 11:03',
        title: 'Chung Cư Thái Bình Tăng Giá, Thị Trường Hình Thành Làn Sóng...'
    }
];

const ArticleList = () => (
    <ul className={styles.list}>
        {articles.map((a, i) => (
            <li key={i} className={styles.item}>
                <p className={styles.date}>{a.date} · Tin tức</p>
                <p className={styles.title}>{a.title}</p>
            </li>
        ))}
    </ul>
);

export default ArticleList;