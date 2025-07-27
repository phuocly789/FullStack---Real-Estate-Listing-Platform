import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.css';
import { useUpdateProfileMutation } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';

const EditProfile = ({ user, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
    });
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const validatePhone = (phone) => {
        return /^0[0-9]{9}$/.test(phone);
    };

    const validateImageUrl = (url) => {
        return /.*\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url === '';
    };

    const validateName = (name) => {
        return /^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Lọc ký tự cho phone (chỉ cho phép số)
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
        const confirmChange = window.confirm('Bạn có chắc chắn muốn sửa thông tin?');
        if (!confirmChange) return;
        // Kiểm tra họ tên
        if (!validateName(formData.name)) {
            setToast({ message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        // Kiểm tra số điện thoại nếu có nhập
        if (formData.phone && !validatePhone(formData.phone)) {
            setToast({ message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        // Kiểm tra URL avatar nếu có nhập
        if (formData.avatar && !validateImageUrl(formData.avatar)) {
            setToast({ message: 'URL avatar phải là hình ảnh (jpg, jpeg, png, webp, gif)!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                avatar: formData.avatar,
            }).unwrap();

            setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
            setIsSuccess(true);

            setTimeout(() => {
                setToast({ message: '', type: '' });
                setIsSuccess(null);
                if (onUpdateSuccess) {
                    onUpdateSuccess();
                } else {
                    window.location.reload();
                }
            }, 3000);
        } catch (error) {
            const errorMessage = error?.data?.message || 'Lỗi khi cập nhật thông tin';
            setToast({ message: errorMessage, type: 'error' });
            setIsSuccess(false);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <Toast
                message={toast.message}
                type={toast.type}
                isSuccess={isSuccess}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />
            <section className={styles.section}>
                <h3>Thông tin cá nhân</h3>
                <div className={styles.avatarUpload}>
                    <input
                        type="text"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="Nhập URL avatar"
                        className={styles.avatarInput}
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <h3>Thông tin liên hệ</h3>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={(e) => {
                                if (e.target.value && !validatePhone(e.target.value)) {
                                    setToast({ message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số!', type: 'error' });
                                    setIsSuccess(false);
                                }
                            }}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                        />
                        <small>Email không thể thay đổi trực tiếp. Liên hệ hỗ trợ để cập nhật.</small>
                    </div>
                </div>
            </section>
            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
};

export default EditProfile;