import React from "react";
import styles from "./Profile.module.css"; // Assuming you have a CSS module for styling
import SlideBar from "./SlideBar/SlideBar";
import Dashboard from "./Dashboard/Dashboard";
const Profile = () => {
    return (
        <div className={styles.container}>
            <SlideBar />
            <div className={styles.mainContent}>
                <Dashboard />
            </div>
        </div>
    );
};
export default Profile;
