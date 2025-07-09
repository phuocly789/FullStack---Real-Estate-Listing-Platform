import React from "react";
import styles from "./ViewProfile.module.css";

const ViewProfile = ({ user }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (!user) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    return (

        <form className={styles.container}>
            {/* Thông tin cá nhân */}
            <section className={styles.section}>
                <h3>Thông tin cá nhân</h3>
                <div className={styles.avatarUpload}>
                    <img
                        className={styles.avatarPlaceholder}
                        src={user.avatar || "/default-avatar.png"} // Cung cấp ảnh mặc định nếu avatar không tồn tại
                        alt="avatar"
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Họ và tên</label>
                        <input type="text" defaultValue={user.name || ""} disabled />
                    </div>
                    {/* <div className={styles.inputGroup}>
                        <label>Giới Tính</label>
                        <input type="text" defaultValue={user.gender || "Chưa cung cấp"} disabled />
                    </div> */}
                </div>
            </section>

            {/* Thông tin liên hệ */}
            <section className={styles.section}>
                <h3>Thông tin liên hệ</h3>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Số điện thoại chính</label>
                        <input type="text" defaultValue={user.phone || "Chưa cung cấp"} disabled />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" defaultValue={user.email || ""} disabled />
                    </div>
                </div>
            </section>

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.saveButton} onClick={handleLogout}>
                    Đăng Xuất
                </button>
            </div>
        </form>
    );
};

export default ViewProfile;