import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useLoginMutation } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';
const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'USER',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast({ message: '', type: '' });
        setIsSuccess(null);

        try {
            const res = await login(formData).unwrap();

            const token = res.access_token;
            if (!token) throw new Error('Không tìm thấy token');

            localStorage.setItem('token', token);

            setToast({ message: 'Đăng nhập thành công!', type: 'success' });
            setIsSuccess(true);

            // 👉 Decode token để lấy role
            const decoded = JSON.parse(atob(token.split('.')[1]));
            const role = decoded?.role;

            setTimeout(() => {
                if (role === 'ADMIN') {
                    window.location.href = '/admin'; // hoặc trang admin tương ứng
                } else {
                    window.location.href = '/'; // Trang người dùng
                }
            }, 1500);
        } catch (error) {
            const errorMessage =
                error?.data?.message || error?.error || 'Đăng nhập thất bại!';

            setToast({
                message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
                type: 'error',
            });
            setIsSuccess(false);
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
            <Toast
                message={toast.message}
                type={toast.type}
                isSuccess={isSuccess}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.roleSelect}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="USER"
                            checked={formData.role === 'USER'}
                            onChange={handleChange}
                        />
                        Người dùng
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="ADMIN"
                            checked={formData.role === 'ADMIN'}
                            onChange={handleChange}
                        />
                        Quản trị viên
                    </label>
                </div>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
};

export default Login;