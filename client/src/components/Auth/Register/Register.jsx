import React, { useEffect, useState } from 'react';
import styles from './Register.module.css';
import { useRegisterMutation } from '../../../api/apiSlice';
import { useNavigate } from 'react-router-dom';
import Toast from '../../Toast/Toast';

const Register = () => {
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null); // Thêm state isSuccess
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
        setToast({ message: '', type: '' }); // Xóa thông báo cũ
        setIsSuccess(null); // Reset trạng thái

        try {
            const response = await register(formData).unwrap();
            localStorage.setItem('token', response.access_token);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            const errorMessage = error.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
            setToast({ message: errorMessage, type: 'error' });
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => {
                setToast({ message: '', type: '' });
                setIsSuccess(null);
            }, 3000); // Tự tắt sau 3 giây

            return () => clearTimeout(timer); // Clear nếu component unmount
        }
    }, [toast]);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <a href="/" className={styles.backLink}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    className={styles.biArrowLeft}
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
                isSuccess={isSuccess}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
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
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
        </form>
    );
};

export default Register;