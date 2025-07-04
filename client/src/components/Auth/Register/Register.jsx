import React, { useEffect, useState } from 'react';
import styles from './Register.module.css';
import { useRegisterMutation } from '../../../api/apiSlice';
import { useNavigate } from 'react-router-dom';
import Toast from '../../Toast/Toast';
const Register = () => {
    const [toast, setToast] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { access_token } = await register(formData).unwrap();
            localStorage.setItem('token', access_token);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });


            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Đăng ký thất bại!',
                type: 'error',
            });
        }
    };
    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 3000); // Tự tắt sau 3 giây

            return () => clearTimeout(timer); // Clear nếu component unmount
        }
    }, [toast]);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <h2>Đăng ký</h2>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />
            <input
                type="text"
                name="name"
                placeholder="Tên đầy đủ"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
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
            <button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
        </form>
    );
};

export default Register;