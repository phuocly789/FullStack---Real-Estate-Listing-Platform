import React from "react";
import styles from "./OverView.module.css"; // Assuming you have a CSS module for styling

const OverView = () => {
    return(
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
    );
}
export default OverView;