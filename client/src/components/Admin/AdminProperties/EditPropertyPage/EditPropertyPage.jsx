import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPropertyQuery, useUpdatePropertyMutation } from '../../../../api/apiSlice';
import EditPropertyForm from '../EditProperty';
import Toast from '../../../Toast/Toast';
import styles from '../PropertyForm.module.css';

const EditPropertyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: property, isLoading, error } = useGetPropertyQuery(id);
    const [updateProperty] = useUpdatePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });

    console.log('EditPropertyPage: ID từ URL', id);
    console.log('EditPropertyPage: Dữ liệu bất động sản', property);
    console.log('EditPropertyPage: Trạng thái', { isLoading, error });

    if (error) {
        console.error('EditPropertyPage: Lỗi tải dữ liệu', error);
        return <div>Lỗi: {JSON.stringify(error)}</div>;
    }

    if (isLoading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    const handleSubmit = async (formData) => {
        try {
            console.log('EditPropertyPage: Gửi dữ liệu cập nhật', { id, ...formData });
            await updateProperty({ id, ...formData }).unwrap();
            setToast({ message: 'Cập nhật thành công', type: 'success' });
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                navigate('/admin_properties');
            }, 3000);
        } catch (err) {
            console.error('EditPropertyPage: Lỗi cập nhật', err);
            setToast({ message: err?.data?.message || 'Lỗi khi cập nhật', type: 'error' });
        }
    };

    return (
        <div className='container'>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />
            <EditPropertyForm
                initialValues={property || {}}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default EditPropertyPage;