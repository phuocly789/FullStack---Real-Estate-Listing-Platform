import React, { use, useState } from "react";
import styles from "./LoginPage.module.css";
import Register from "../../components/Auth/Register/Register";
import Login from "../../components/Auth/Login/Login";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const handleToggle = () => {
        setIsLogin(!isLogin);
    };
    return (
        <div className={styles.container}>
           
            <div className={`${styles.formContainer} ${isLogin ? styles.slideIn : styles.slideOut}`}>
                {isLogin ? <Login /> : <Register />}
            </div>
            <button className={styles.switchButton} onClick={handleToggle}>
                {isLogin ? "Bạn chưa có tài khoản? Đăng Ký" : "Bạn đã có tài khoản? Đăng Nhập"}
            </button>
        </div>
    );
}
export default LoginPage;