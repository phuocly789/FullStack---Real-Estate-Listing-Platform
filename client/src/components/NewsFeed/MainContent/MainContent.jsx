import React, { useState } from 'react';
import AdSection from '../AdSection/AdSection';
import background from '../../../assets/images/bg2.png';
import bg1 from '../../../assets/images/hcm.jpg';
import bg2 from '../../../assets/images/hanoi.jpg';
import bg3 from '../../../assets/images/danang.jpg';
import bg4 from '../../../assets/images/binhduong.jpg';
import bg5 from '../../../assets/images/dongnai.jpg';
import styles from './MainContent.module.css';


const Tabs = [
    { id: 'featured', label: 'Tin Nổi Bật' },
    { id: 'news', label: 'Tin Tức' },
    { id: 'hcm', label: 'BĐS HCM' },
    { id: 'hn', label: 'BĐS HN' },
    { id: 'more', label: 'Xem Thêm' },
]
const Data = {
    featured: {
        image: background,
        title: 'Lựa chọn vay thế chấp từ ngân hàng là một trong những giải pháp tài ...',
        time: '7 phút trước',
        links: [
            'Top 10 Ngân Hàng Cho Vay Lãi Suất Thấp...',
            'Đất Nền Đông Anh Vẫn Neo Giá Cao...',
            'BĐS Thanh Hóa: Loạt Dự Án Mới...',
            '100 Triệu Giảm Hàng AgriBank...',
            'Sáp Nhập Thành Viên Thành Động...',
            'Đất Nền Phú Quốc Tiếp Tục Hấp Dẫn',
        ],
    },
    news: {
        image: bg3,
        title: 'Lựa chọn vay thế chấp từ ngân hàng là một trong những giải pháp tài ...',
        time: '27 phút trước',
        links: [
            'Top 10 Ngân Hàng Cho Vay Lãi Suất Thấp...',
            'Đất Nền Đông Anh Vẫn Neo Giá Cao...',
            'BĐS Thanh Hóa: Loạt Dự Án Mới...',
            '100 Triệu Giảm Hàng AgriBank...',
            'Sáp Nhập Thành Viên Thành Động...',
            'Đất Nền Phú Quốc Tiếp Tục Hấp Dẫn',
        ],
    },
    hcm: {
        image: bg1,
        title: 'Lựa chọn vay thế chấp từ ngân hàng là một trong những giải pháp tài ...',
        time: '27 phút trước',
        links: [
            'Top 10 Ngân Hàng Cho Vay Lãi Suất Thấp...',
            'Đất Nền Đông Anh Vẫn Neo Giá Cao...',
            'BĐS Thanh Hóa: Loạt Dự Án Mới...',
            '100 Triệu Giảm Hàng AgriBank...',
            'Sáp Nhập Thành Viên Thành Động...',
            'Đất Nền Phú Quốc Tiếp Tục Hấp Dẫn',
        ],
    },
    hn: {
        image: bg2,
        title: 'Lựa chọn vay thế chấp từ ngân hàng là một trong những giải pháp tài ...',
        time: '17 phút trước',
        links: [
            'Top 10 Ngân Hàng Cho Vay Lãi Suất Thấp...',
            'Đất Nền Đông Anh Vẫn Neo Giá Cao...',
            'BĐS Thanh Hóa: Loạt Dự Án Mới...',
            '100 Triệu Giảm Hàng AgriBank...',
            'Sáp Nhập Thành Viên Thành Động...',
            'Đất Nền Phú Quốc Tiếp Tục Hấp Dẫn',
        ],
    },
    more: {
        image: bg5,
        title: 'Lựa chọn vay thế chấp từ ngân hàng là một trong những giải pháp tài ...',
        time: '47 phút trước',
        links: [
            'Top 10 Ngân Hàng Cho Vay Lãi Suất Thấp...',
            'Đất Nền Đông Anh Vẫn Neo Giá Cao...',
            'BĐS Thanh Hóa: Loạt Dự Án Mới...',
            '100 Triệu Giảm Hàng AgriBank...',
            'Sáp Nhập Thành Viên Thành Động...',
            'Đất Nền Phú Quốc Tiếp Tục Hấp Dẫn',
        ],
    },
}
const MainContent = () => {
    const [activeTab, setActiveTab] = useState('featured');
    const current = Data[activeTab];

    return (
        <div className="container-fluid">
            <ul className="nav nav-tabs mb-3">
                {Tabs.map((tab) => (
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
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-6">
                            <div className={styles.mainArticle}>
                                <img src={current.image} alt="House" className={`${styles.articleImage} img-fluid mb-2`} />
                                <h2 className={styles.articleTitle}>{current.title}</h2>
                                <p className={styles.articleTime}>{current.time}</p>

                            </div>
                        </div>
                        <div className="col-md-6">
                            <ul className={styles.articleList}>
                                {current.links.map((item, i) => (
                                    <li key={i} className={styles.articleListItem}>
                                        <a href="#" className={styles.articleListLink}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <AdSection />
                </div>
            </div>
        </div>
    );
};

export default MainContent;
