import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.css';
import { useUpdateProfileMutation } from '../../../api/apiSlice';

const EditProfile = ({ user, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const [showSecondaryPhone, setShowSecondaryPhone] = useState(false);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Gửi yêu cầu cập nhật thông tin người dùng
            await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                avatar: formData.avatar,
            }).unwrap();

            setMessage('Cập nhật thông tin thành công!');
            setIsSuccess(true);

            // Xóa thông báo sau 3 giây
            setTimeout(() => {
                setMessage('');
                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }
            }, 3000);
        } catch (error) {
            setMessage(error.data?.message || 'Lỗi khi cập nhật thông tin');
            setIsSuccess(false);
        }
    };

    const handleAddSecondaryPhone = () => {
        setShowSecondaryPhone(true);
    };

    // Kiểm tra định dạng số điện thoại
    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    };


    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            {/* Thông báo */}
            {message && (
                <p className={isSuccess ? styles.success : styles.error}>{message}</p>
            )}

            {/* Thông tin cá nhân */}
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

            {/* Thông tin liên hệ */}
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
                                    setMessage('Số điện thoại không hợp lệ (10-11 chữ số)');
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
                            disabled // Không cho phép chỉnh sửa email trực tiếp
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