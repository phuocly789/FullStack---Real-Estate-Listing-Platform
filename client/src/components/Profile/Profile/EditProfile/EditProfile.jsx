import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditProfile.module.css';

const EditProfile = ({ user, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        // avatar: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                // avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // 👈 Xóa thông báo cũ trước khi gọi API

        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(
                'http://localhost:3000/auth/update',
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    // avatar: formData.avatar,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage('Cập nhật thông tin thành công!');
            setIsSuccess(true);
            setTimeout(() => {
                setMessage('');
                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }

            }, 3000);

            // ✅ Gọi callback nếu có
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }

        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
            setIsSuccess(false);
        }
    };


    const handleAddSecondaryPhone = () => {
        setShowSecondaryPhone(true);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Thông báo */}
            {message && (
                <p className={isSuccess ? styles.success : styles.error}>
                    {message}
                </p>
            )}


            {/* Thông tin cá nhân */}
            <section className={styles.section}>
                <h3>Thông tin cá nhân</h3>
                <div className={styles.avatarUpload}>
                    <input
                        type="text"
                        name="avatar"
                        // value={formData.avatar}
                        // onChange={handleChange}
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
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Mã số thuế cá nhân</label>
                        <input
                            type="text"
                            name="taxCode"
                            // value={formData.taxCode}
                            // onChange={handleChange}
                            placeholder="VD: 1234567890 hoặc 1234567890-123"
                        />
                        <small>MST gồm 10 hoặc 13 chữ số</small>
                    </div>
                </div>
            </section>

            {/* Thông tin liên hệ */}
            <section className={styles.section}>
                <h3>Thông tin liên hệ</h3>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Số điện thoại chính</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {/* {!showSecondaryPhone && (
                            <span className={styles.addPhone} onClick={handleAddSecondaryPhone}>
                                + Thêm số điện thoại
                            </span>
                        )}
                        {showSecondaryPhone && (
                            <div className={styles.inputGroup}>
                                <label>Số điện thoại phụ</label>
                                <input
                                    type="text"
                                    name="secondaryPhone"
                                    value={formData.secondaryPhone}
                                    onChange={handleChange}
                                />
                            </div>
                        )} */}
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}

                        />
                    </div>
                </div>
            </section>

            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton}>
                    Lưu thay đổi
                </button>
            </div>
        </form>
    );
};

export default EditProfile;