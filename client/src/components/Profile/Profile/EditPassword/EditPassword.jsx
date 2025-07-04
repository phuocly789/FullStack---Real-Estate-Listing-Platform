import React, { useState } from 'react';
import styles from './EditPassword.module.css';

const EditPassword = () => {
    const [email, setEmail] = useState('');
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.container}>

            {/* Đổi mật khẩu */}
            <section className={styles.section}>
                <h3>Đổi mật khẩu</h3>
                <div className={styles.passwordForm}>
                    <div className={styles.inputGroup}>
                        <label>Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={form.oldPassword}
                            onChange={handleInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleInput}
                        />
                    </div>
                    <button className={styles.saveButton}>Lưu mật khẩu mới</button>
                </div>
            </section>

            {/* Yêu cầu khóa tài khoản
            <section className={styles.section}>
                <h3>Yêu cầu khóa tài khoản</h3>
                <div className={styles.inputGroup}>
                    <label>Nhập email hiện tại</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button className={styles.dangerButton}>Khóa tài khoản</button>
                </div>
                <ul className={styles.noteList}>
                    <li>Quý khách sẽ không thể đăng nhập lại vào tài khoản này sau khi khóa.</li>
                    <li>Các tin đăng đang hiển thị của quý khách sẽ tiếp tục được hiển thị cho đến hết thời gian đăng tin đã chọn.</li>
                    <li>Số dư tiền (nếu có) trong các tài khoản của quý khách sẽ không được hoàn lại.</li>
                    <li>Tài khoản chỉ được mở lại khi chính quý khách có thể xác minh quyền sở hữu.</li>
                    <li>Số điện thoại đăng tin tài khoản này và các số điện thoại đang được cấu hình khác sẽ không thể được sử dụng để đăng ký tài khoản mới.</li>
                    <li>Trong trường hợp bạn muốn sử dụng lại số điện thoại, vui lòng liên hệ CSKH 1900.1881 để được hỗ trợ.</li>
                </ul>
            </section> */}

            {/* Yêu cầu xóa tài khoản */}
            <section className={styles.section}>
                <h3>Yêu cầu xóa tài khoản</h3>
                <p>
                    Gửi yêu cầu xóa toàn bộ thông tin của tài khoản. Sau khi được xử lý, toàn bộ thông tin sẽ được xóa vĩnh viễn
                    và không thể hoàn tác.
                </p>
                <button className={styles.dangerButton}>Yêu cầu xóa tài khoản</button>
            </section>
        </div>
    );
};

export default EditPassword;
