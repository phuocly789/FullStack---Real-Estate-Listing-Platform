import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import SlideBar from "../SlideBar/SlideBar";
import axios from "axios";
import ViewProfile from "./ViewProfile/ViewProfile";
import EditProfile from "./EditProfile/EditProfile";
import EditPassword from "./EditPassword/EditPassword";

const Profile = () => {
    console.log("Đã render component Profile");
    const [user, setUser] = useState(null);
    console.log("hello"); // kiểm tra xem class có in ra không

    const feachUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get('http://localhost:3000/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
            } catch (error) {
                console.error('Lỗi lấy thông tin người dùng:', error);
                localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
                setUser(null);
            }
        }
    };

    useEffect(() => {
        feachUser();
    }, []);



    const [activeTab, setActiveTab] = useState("viewProfile");

    const renderContent = () => {
        switch (activeTab) {
            case "viewProfile":
                return <ViewProfile user={user} />;
            case "editProfile":
                return <EditProfile user={user} onUpdateSuccess={feachUser} />;
            case "editPassword":
                return <EditPassword />;
            default:
                return <ViewProfile user={user} />;
        }
    }


    return (

        <div className={styles.container}>
            <h2 className={styles.heading}>Quản lý tài khoản</h2>

            {/* Tabs nằm riêng */}
            <div className={styles.tabs}>
                <button
                    className={`${activeTab === 'viewProfile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('viewProfile')}
                >
                    Thông tin tài khoản
                </button>
                <button
                    className={`${activeTab === 'editProfile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('editProfile')}
                >
                    Chỉnh sửa tài khoản
                </button>
                <button
                    className={`${activeTab === 'editPassword' ? styles.active : ''}`}
                    onClick={() => setActiveTab('editPassword')}
                >
                    Đổi mật khẩu
                </button>
            </div>

            {/* Nội dung tab được hiển thị dưới đây */}
            <div className={styles.mainContent}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Profile;