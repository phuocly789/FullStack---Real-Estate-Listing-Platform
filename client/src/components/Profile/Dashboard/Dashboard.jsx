import React from "react";
import styles from "./Dashboard.module.css";
import Slidebar from "../SlideBar/SlideBar";
import { Routes, Route } from "react-router-dom";
import Profile from "../Profile";
import OverView from "../OverView/OverView";

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <Slidebar />
            <div className={styles.mainContent}>
                <Routes>
                    <Route path="profile" element={<Profile />} />
                    <Route path="overview" element={<OverView />} />
                    {/* Thêm các tuyến đường khác nếu cần */}
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;