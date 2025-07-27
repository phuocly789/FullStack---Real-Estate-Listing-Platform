import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import Register from '../../components/Auth/Register/Register';
import Login from '../../components/Auth/Login/Login';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra query parameter để đặt trạng thái isLogin
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const view = params.get('view');
        setIsLogin(view !== 'register');
    }, [location.search]);

    const handleToggle = () => {
        const newView = isLogin ? 'register' : 'login';
        navigate(`/login?view=${newView}`, { replace: true });
        setIsLogin(!isLogin);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.formContainer} ${isLogin ? styles.slideIn : styles.slideOut}`}>
                {isLogin ? <Login /> : <Register />}
            </div>
            <button className={styles.switchButton} onClick={handleToggle}>
                {isLogin ? 'Bạn chưa có tài khoản? Đăng Ký' : 'Bạn đã có tài khoản? Đăng Nhập'}
            </button>
        </div>
    );
};

export default LoginPage;