import React from 'react';
import styles from './ContactInfo.module.css';
import { useGetPropertyCountByUserQuery, useGetUserByIdQuery } from '../../../api/apiSlice';

const ContactInfo = ({ userid }) => {
    const { data: user, isLoading, isError } = useGetUserByIdQuery(userid);
    const { data: count } = useGetPropertyCountByUserQuery(userid);

    if (isLoading) {
        return <div className='text-center mt-5'>Loading</div>
    }
    if (isError) {
        return <div className='text-center mt-5'>Không tìm thấy thông tin liên hệ</div>
    }
    return (
        <div className={styles.contact}>
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
            <p className={styles.phone}>SĐT: {user.phone}</p>
            
            <button className={styles.chatButton}>Chat qua Zalo</button>
        </div>
    );
};

export default ContactInfo;