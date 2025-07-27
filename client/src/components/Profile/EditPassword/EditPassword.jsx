import React, { useState } from 'react';
import styles from './EditPassword.module.css';
import { useChangePasswordMutation, useDeleteAccountMutation } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';
import { useNavigate } from 'react-router-dom';

const EditPassword = ({ onUpdateSuccess }) => {
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
    const navigate = useNavigate();

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setToast({ message: '', type: '' });
        setIsSuccess(null);

        // Xác nhận trước khi đổi mật khẩu
        const confirmChange = window.confirm('Bạn có chắc chắn muốn đổi mật khẩu?');
        if (!confirmChange) return;

        // Kiểm tra hợp lệ
        if (form.newPassword !== form.confirmPassword) {
            setToast({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp', type: 'error' });
            setIsSuccess(false);
            return;
        }

        if (form.newPassword.length < 6) {
            setToast({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự', type: 'error' });
            setIsSuccess(false);
            return;
        }

        try {
            await changePassword({
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            }).unwrap();

            // Hiển thị thông báo
            setToast({ message: 'Đổi mật khẩu thành công. Hệ thống sẽ tự động đăng xuất...', type: 'success' });
            setIsSuccess(true);
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });

            // Đăng xuất sau 2s
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login');
            }, 2000);
        } catch (error) {
            setToast({
                message: error.data?.message || 'Đổi mật khẩu thất bại! Vui lòng thử lại.',
                type: 'error',
            });
            setIsSuccess(false);
        }
    };


    const handleDeleteAccount = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
            return;
        }

        setToast({ message: '', type: '' });
        setIsSuccess(null);

        try {
            await deleteAccount().unwrap();
            setToast({ message: 'Yêu cầu xóa tài khoản đã được xử lý', type: 'success' });
            setIsSuccess(true);
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login');
            }, 1500);
        } catch (error) {
            setToast({
                message: error.data?.message || 'Xóa tài khoản thất bại! Vui lòng thử lại.',
                type: 'error',
            });
            setIsSuccess(false);
        }
    };

    return (
        <div className={styles.container}>
            <Toast
                message={toast.message}
                type={toast.type}
                isSuccess={isSuccess}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
                }}
            />

            {/* Đổi mật khẩu */}
            <section className={styles.section}>
                <h3>Đổi mật khẩu</h3>
                <form className={styles.passwordForm} onSubmit={handleChangePassword}>
                    <div className={styles.inputGroup}>
                        <label>Mật khẩu hiện tại</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.oldPassword ? 'text' : 'password'}
                                name="oldPassword"
                                value={form.oldPassword}
                                onChange={handleInput}
                                required
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => toggleShowPassword('oldPassword')}
                            >
                                {showPasswords.oldPassword ? (
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
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Mật khẩu mới</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.newPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleInput}
                                required
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => toggleShowPassword('newPassword')}
                            >
                                {showPasswords.newPassword ? (
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
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Xác nhận mật khẩu mới</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPasswords.confirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleInput}
                                required
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => toggleShowPassword('confirmPassword')}
                            >
                                {showPasswords.confirmPassword ? (
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
                        </div>
                    </div>
                    <button type="submit" className={styles.saveButton} disabled={isChangingPassword}>
                        {isChangingPassword ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                    </button>
                </form>
            </section>

            {/* Yêu cầu xóa tài khoản */}
            <section className={styles.section}>
                <h3>Yêu cầu xóa tài khoản</h3>
                <p>
                    Gửi yêu cầu xóa toàn bộ thông tin của tài khoản. Sau khi được xử lý, toàn bộ thông tin sẽ được xóa vĩnh viễn
                    và không thể hoàn tác.
                </p>
                <button
                    className={styles.dangerButton}
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                >
                    {isDeletingAccount ? 'Đang xóa...' : 'Yêu cầu xóa tài khoản'}
                </button>
            </section>
        </div>
    );
};

export default EditPassword;