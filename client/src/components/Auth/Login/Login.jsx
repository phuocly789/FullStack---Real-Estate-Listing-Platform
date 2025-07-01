import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/auth/login', formData);
            console.log('Phản hồi từ API:', res.data); // Ghi log để kiểm tra
            const token = res.data.access_token; // Sử dụng access_token thay vì token
            if (!token) {
                throw new Error('Không tìm thấy token trong phản hồi API');
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(res.data.user || {})); // Lưu user nếu có
            alert('Đăng nhập thành công!');
            window.location.href = '/';
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            alert(error.response?.data?.message || 'Lỗi đăng nhập');
        }
    };

    return (
        <div className={styles.formContainer}>
            <a href="/">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    className={`bi ${styles.biArrowLeft}`}
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                    />
                </svg>
            </a>
            <h2>Đăng nhập</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;