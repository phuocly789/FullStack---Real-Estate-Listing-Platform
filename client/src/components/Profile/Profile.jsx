import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import ViewProfile from "./ViewProfile/ViewProfile";
import EditProfile from "./EditProfile/EditProfile";
import EditPassword from "./EditPassword/EditPassword";
import { useGetProfileQuery } from "../../api/apiSlice";

const Profile = () => {
    // Lấy dữ liệu từ useGetProfileQuery
    const { data: user, isLoading, isError } = useGetProfileQuery(undefined, {
        skip: !localStorage.getItem("token"), // Bỏ qua query nếu không có token
    });

    const [activeTab, setActiveTab] = useState("viewProfile");
    const [toast, setToast] = useState({ message: "", type: "" });

    // Xử lý lỗi token không hợp lệ
    useEffect(() => {
        if (isError && localStorage.getItem("token")) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
        }
    }, [isError]);

    const renderContent = () => {
        switch (activeTab) {
            case "viewProfile":
                return <ViewProfile user={user} />;
            case "editProfile":
                return <EditProfile user={user} onUpdateSuccess={() => refetch()} />;
            case "editPassword":
                return <EditPassword />;
            default:
                return <ViewProfile user={user} onUpdateSuccess={() => refetch()} />;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Quản lý tài khoản</h2>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${activeTab === "viewProfile" ? styles.active : ""}`}
                    onClick={() => setActiveTab("viewProfile")}
                >
                    Thông tin tài khoản
                </button>
                <button
                    className={`${activeTab === "editProfile" ? styles.active : ""}`}
                    onClick={() => setActiveTab("editProfile")}
                >
                    Chỉnh sửa tài khoản
                </button>
                <button
                    className={`${activeTab === "editPassword" ? styles.active : ""}`}
                    onClick={() => setActiveTab("editPassword")}
                >
                    Đổi mật khẩu
                </button>
            </div>

            {/* Nội dung tab */}
            <div className={styles.mainContent}>
                {isLoading ? (
                    <p>Đang tải thông tin người dùng...</p>
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};

export default Profile;