import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPropertyQuery, useUpdatePropertyMutation } from '../../../api/apiSlice';
import PropertyForm from './PropertyForm'; // component form dùng chung
import Toast from '../../Toast/Toast';
import styles from './EditProperty.module.css'
const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: property, isLoading } = useGetPropertyQuery(id);
    const [updateProperty, { isLoading: loadingEdit }] = useUpdatePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const handleSubmit = async (values) => {
        try {
            await updateProperty({ id, ...values }).unwrap();
            setToast({ message: 'Cập nhật thành công!', type: 'success' });
            setTimeout(() => navigate('/admin_properties'), 1500);
        } catch (err) {
            setToast({
                message: 'Lỗi khi cập nhật: ' + (err?.data?.message || err.message),
                type: 'error',
            });
            setTimeout(() => {
                setToast({ message: '', type: '' });
            }, 3000);
        }
    };
    const isAnyLoading = isLoading || loadingEdit;

    return (
        <div className="container mt-5">
            <h2>Chỉnh sửa Bất Động Sản</h2>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />

            {isLoading && <p>Đang tải dữ liệu...</p>}
            {!isLoading && property && (
                <PropertyForm initialValues={property} onSubmit={handleSubmit} />
            )}
            {
                isAnyLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                )
            }
        </div>
    );
};

export default EditProperty;
