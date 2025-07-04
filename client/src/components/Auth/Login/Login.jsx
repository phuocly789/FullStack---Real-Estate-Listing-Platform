import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { useLoginMutation } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';
const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
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
            const res = await login(formData).unwrap();
            console.log('Phản hồi từ API:', res);

            const token = res.access_token;
            if (!token) throw new Error('Không tìm thấy token');

            localStorage.setItem('token', token);

            setTimeout(() => {
                setToast({ message: 'Đăng nhập thành công!', type: 'success' });
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Đăng nhập thất bại!',
                type: 'error',
            });
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
                onClose={() => setToast({ message: '', type: '' })}
            />
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
};

export default Login;