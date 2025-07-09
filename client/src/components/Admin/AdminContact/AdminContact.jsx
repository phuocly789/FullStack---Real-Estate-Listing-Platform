import React, { useState } from 'react';
import styles from './ContactInfo.module.css';
import { useGetPropertyCountByUserQuery, useGetUserByIdQuery } from '../../../api/apiSlice';
import { Toast } from 'react-bootstrap';

const ContactInfo = ({ userid, propertyid }) => {
    const { data: user, isLoading, isError } = useGetUserByIdQuery(userid);
    const { data: count } = useGetPropertyCountByUserQuery(userid);
    const [message, setMessage] = useState('');
    const [createContact, { isLoading: sending }] = useCreateContactMutation();
    const [toast, setToast] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (isLoading) {
        return <div className='text-center mt-5'>Loading</div>
    }
    if (isError) {
        return <div className='text-center mt-5'>Không tìm thấy thông tin liên hệ</div>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createContact({
                message,
                userId: userid,
                propertyId: propertyid,
            }).unwrap();
            setMessage('');
            setToastMessage('Đã gửi yêu cầu liên hệ!');
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            setToastMessage('Lỗi khi gửi liên hệ!');
            setIsSuccess(false);
        }
    };
}

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
            {/* <p className={styles.phone}>SĐT: {user.phone}</p> */}
        </div>
        <div className="row">
            <h4>Gửi tin nhắn đến người đăng</h4>
            <Toast
                message={toast.message}
                type={toast.type}
                isSuccess={isSuccess}
                onClose={() => {
                    setToast({ message: '', type: '' });
                    setIsSuccess(null);
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
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? 'Đang gửi...' : 'Gửi liên hệ'}
                </button>
            </form>
        </div>


    </div>
);


export default ContactInfo;