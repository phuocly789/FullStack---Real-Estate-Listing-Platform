import React from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success', onClose }) => {
    if (!message) return null;

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span>{message}</span>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

export default Toast;
