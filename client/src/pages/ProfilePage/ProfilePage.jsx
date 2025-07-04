import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Profile from "../../components/Profile/Profile/Profile";
import Dashboard from "../../components/Profile/Dashboard/Dashboard";
import styles from "./ProfilePage.module.css"; // Assuming you have a CSS module for styling
import SlideBar from "../../components/Profile/SlideBar/SlideBar";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <Dashboard/>;
            case "personal":
                return <Profile />;
            default:
                return <Dashboard />;
        }
    };
    return (
        <div>
            <Navbar />
            <SlideBar />
            <div className={styles.container}>
                <SlideBar setActiveTab={setActiveTab} activeTab={activeTab} />
                <div className={styles.mainContent}>{renderContent()}</div>
            </div>
            <Footer />
        </div>
    );
};
export default ProfilePage;