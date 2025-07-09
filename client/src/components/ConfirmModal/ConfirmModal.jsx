import React from 'react';
import styles from './ConfirmModal.module.css'
const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <h4 className={styles.modalTitle}>Xác nhận</h4>
                <p className={styles.modalMessage}>{message || 'Bạn có chắc chắn không?'}</p>
                <div className={styles.modalActions}>
                    <button className="btn btn-secondary" onClick={onClose}>Huỷ</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
