import React from 'react';
import styles from './ContactInfo.module.css';

const ContactInfo = ({ contact }) => {
    return (
        <div className={styles.contact}>
            <h3 className={styles.heading}>Thông tin liên hệ</h3>
            <img src={contact.image} alt={contact.name} className={styles.avatar} />
            <p>{contact.name}</p>
            <p>Tham gia: {contact.experience}</p>
            <p>Tin đăng: {contact.posts}</p>
            <button className={styles.chatButton}>Chat qua Zalo</button>
            <p className={styles.phone}>SĐT: {contact.phone} - Hiện số</p>
        </div>
    );
};

export default ContactInfo;