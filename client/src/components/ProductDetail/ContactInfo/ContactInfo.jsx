import React, { useState } from 'react';
import styles from './ContactInfo.module.css';
import { useCreateContactMutation, useGetPropertyCountByUserQuery, useGetUserByIdQuery, useGetContactsQuery, useGetProfileQuery } from '../../../api/apiSlice';
import Toast from '../../Toast/Toast';

const ContactInfo = ({ userid, propertyid }) => {
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(userid);
    const { data: currentUser } = useGetProfileQuery(); // Lấy thông tin người dùng hiện tại
    const { data: count } = useGetPropertyCountByUserQuery(userid);
    const { data: contacts, isLoading: isContactsLoading } = useGetContactsQuery({
        userid: currentUser?.id,
        propertyid,
    }); // Lấy liên hệ của người dùng hiện tại
    const [message, setMessage] = useState('');
    const [createContact, { isLoading: sending }] = useCreateContactMutation();
    const [toast, setToast] = useState({ message: '', type: '' });

    if (isUserLoading || isContactsLoading) {
        return <div className="text-center mt-5">Đang tải...</div>;
    }
    if (isUserError) {
        return <div className="text-center mt-5">Không tìm thấy thông tin liên hệ</div>;
    }
    if (!currentUser) {
        return <div className="text-center mt-5">Vui lòng đăng nhập để gửi liên hệ</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setToast({ message: 'Vui lòng nhập nội dung liên hệ!', type: 'error' });
            return;
        }
        if (!Number.isInteger(Number(userid)) || !Number.isInteger(Number(propertyid))) {
            setToast({ message: 'Dữ liệu không hợp lệ!', type: 'error' });
            return;
        }

        try {
            await createContact({
                message,
                userid: Number(currentUser.id), // Dùng userid của người hiện tại
                propertyid: Number(propertyid),
            }).unwrap();
            setMessage('');
            setToast({ message: 'Đã gửi yêu cầu liên hệ!', type: 'success' });
        } catch (error) {
            console.error('Lỗi gửi liên hệ:', error);
            setToast({ message: error?.data?.message || 'Lỗi khi gửi liên hệ!', type: 'error' });
        }
    };

    return (
        <div className={styles.contact}>
            <div className="row mb-5">
                <h3 className={styles.heading}>Thông tin liên hệ</h3>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <p>{user.name}</p>
                <p>
                    Tham gia:{' '}
                    {new Intl.DateTimeFormat('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }).format(new Date(user.createdAt))}
                </p>
                <p>Tin đăng: {count}</p>
                <p className={styles.phone}>Email: {user.email}</p>
            </div>
            <div className="row mb-5">
                <h4>Gửi tin nhắn đến người đăng</h4>
                <Toast
                    message={toast.message}
                    type={toast.type}
                    // isSuccess={isSuccess}
                    onClose={() => {
                        setToast({ message: '', type: '' });
                    }}
                />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Nội dung liên hệ</label>
                        <textarea
                            className="form-control"
                            id="message"
                            rows="4"
                            placeholder="Nhập nội dung liên hệ..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={sending}>
                        {sending ? 'Đang gửi...' : 'Gửi liên hệ'}
                    </button>
                </form>
            </div>
            <div className="row">
                <h4>Lịch sử liên hệ của bạn</h4>
                {contacts && contacts.length > 0 ? (
                    <ul className={styles.contactList}>
                        {contacts.map((contact) => (
                            <li key={contact.id} className={styles.contactItem}>
                                <div className={styles.contactMessage}>
                                    <strong>Tin nhắn:</strong> {contact.message}
                                </div>
                                <div className={styles.contactStatus}>
                                    <strong>Trạng thái:</strong>{' '}
                                    {contact.status === 'PENDING' ? 'CLOSED' : 'RESPONED'}
                                </div>
                                {contact.replyMessage && (
                                    <div className={styles.contactReply}>
                                        <strong>Phản hồi:</strong> {contact.replyMessage}
                                    </div>
                                )}
                                <div className={styles.contactDate}>
                                    <strong>Gửi lúc:</strong>{' '}
                                    {new Intl.DateTimeFormat('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }).format(new Date(contact.createdat))}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Chưa có liên hệ nào được gửi.</p>
                )}
            </div>
        </div>
    );
};

export default ContactInfo;