import React from "react";
import styles from "./Dashboard.module.css";
import Slidebar from "../SlideBar/SlideBar";
import { Routes, Route } from "react-router-dom";
import Profile from "../Profile/Profile";

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.dashboard}>
                    <div className={styles.card}>
                        <h3>🎯 Tin đăng</h3>
                        <p>0 tin</p>
                        <a href="#">Đăng tin</a>
                    </div>
                    <div className={styles.card}>
                        <h3>🤝 Liên hệ 30 ngày</h3>
                        <p>0 người</p>
                    </div>
                    <div className={styles.cardWarning}>
                        <h3>🎁 Gói hội viên</h3>
                        <p>Tiết kiệm 39%</p>
                        <button>Tìm hiểu ngay</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;