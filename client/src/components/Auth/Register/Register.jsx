import React, { useEffect, useState } from 'react';
import styles from './Register.module.css';
import { useRegisterMutation } from '../../../api/apiSlice';
import { useNavigate } from 'react-router-dom';
import Toast from '../../Toast/Toast';

const Register = () => {
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    // Xóa form khi component mount
    useEffect(() => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
        });
    }, []);

    const validateName = (name) => {
        return /^[A-Za-zÀ-ỹ\s]+$/.test(name);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) return false;

        const validDomains = [
            'gmail.com',
            'yahoo.com',
            'hotmail.com',
            'outlook.com',
            'icloud.com',
            'aol.com',
            'protonmail.com',
            'mail.com',
            'zoho.com',
        ];
        const domain = email.split('@')[1].toLowerCase();
        return validDomains.includes(domain) || /^[^\s@]+\.[a-zA-Z]{2,}$/.test(domain);
    };

    const validatePhone = (phone) => {
        return /^0[0-9]{9}$/.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const filteredValue = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: filteredValue });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast({ message: '', type: '' });
        setIsSuccess(null);

        if (!validateName(formData.name)) {
            setToast({ message: 'Tên chỉ được chứa chữ cái và khoảng trắng!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setToast({ message: 'Email không hợp lệ hoặc domain không được hỗ trợ!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            setToast({ message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        try {
            const response = await register(formData).unwrap();
            localStorage.setItem('token', response.access_token);
            setToast({ message: 'Đăng ký thành công!', type: 'success' });
            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login?view=login', { replace: true });
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
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <a href="/login?view=login" className={styles.backLink}>
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
            <div className={styles.passwordContainer}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="button"
                    className={styles.showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <span className={styles.eyeIcon}>
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M13.359 11.238C15.06 10.72 16 9.5 16 8c0-1.5-1.94-2.72-3.641-3.238a.5.5 0 0 0-.59.808C13.12 6.332 14 7.12 14 8c0 .88-.88 1.668-2.231 2.43a.5.5 0 0 0 .59.808zM2.641 4.762C.94 5.28 0 6.5 0 8c0 1.5 1.94 2.72 3.641 3.238a.5.5 0 0 0 .59-.808C2.88 9.668 2 8.88 2 8c0-.88.88-1.668 2.231-2.43a.5.5 0 0 0-.59-.808zM8 3.5c-2.12 0-3.879 1.168-5.168 2.457a13.134 13.134 0 0 0-1.172 1.543.5.5 0 0 0 0 .606c.297.46.702 1.02 1.172 1.543C4.121 10.832 5.88 12 8 12c2.12 0 3.879-1.168 5.168-2.457a13.134 13.134 0 0 0 1.172-1.543.5.5 0 0 0 0-.606c-.297-.46-.702-1.02-1.172-1.543C11.879 4.668 10.12 3.5 8 3.5zm0 8.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                <path d="M2.5 1.5l.5.5 11 11-.5.5-11-11z" />
                            </svg>
                        )}
                    </span>
                </button>
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
        </form>
    );
};

export default Register;