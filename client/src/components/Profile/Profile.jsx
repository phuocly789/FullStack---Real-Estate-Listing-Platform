import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import ViewProfile from './ViewProfile/ViewProfile';
import EditProfile from './EditProfile/EditProfile';
import EditPassword from './EditPassword/EditPassword';
import { useGetProfileQuery } from '../../api/apiSlice';

const Profile = () => {
    const { data: user, isLoading, isError, refetch } = useGetProfileQuery(undefined, {
        skip: !localStorage.getItem('token'),
    });

    const [activeTab, setActiveTab] = useState('viewProfile');
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        if (isError && localStorage.getItem('token')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }, [isError]);

    const renderContent = () => {
        switch (activeTab) {
            case 'viewProfile':
                return <ViewProfile user={user} />;
            case 'editProfile':
                return <EditProfile user={user} onUpdateSuccess={refetch} />;
            case 'editPassword':
                return <EditPassword />;
            default:
                return <ViewProfile user={user} />;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Quản lý tài khoản</h2>
            <div className={styles.tabs}>
                <button
                    className={`${activeTab === 'viewProfile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('viewProfile')}
                >
                    Thông tin tài khoản
                </button>
                <button
                    className={`${activeTab === 'editProfile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('editProfile')}
                >
                    Chỉnh sửa tài khoản
                </button>
                <button
                    className={`${activeTab === 'editPassword' ? styles.active : ''}`}
                    onClick={() => setActiveTab('editPassword')}
                >
                    Đổi mật khẩu
                </button>
            </div>
            <div className={styles.mainContent}>
                {isLoading ? (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};

export default Profile;