import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPropertyQuery, useUpdatePropertyMutation } from '../../../../api/apiSlice';
// import EditPropertyForm from '.././EditPropertyForm';
// import Toast from '../../Toast/Toast';
import EditPropertyForm from '../EditProperty';
import Toast from '../../../Toast/Toast';
import styles from '../PropertyForm.module.css';
const EditPropertyPage = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const { data: property, isLoading, error } = useGetPropertyQuery(id); // Gọi API lấy bất động sản
    const [updateProperty] = useUpdatePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    
    console.log('EditPropertyPage: ID từ URL', id);
    console.log('EditPropertyPage: Dữ liệu bất động sản', property);
    
    
    const isAnyLoading = isLoading;
    if (error) return <div>Lỗi: {JSON.stringify(error)}</div>;

    const handleSubmit = async (formData) => {
        try {
            console.log('EditPropertyPage: Gửi dữ liệu cập nhật', { id, ...formData });
            await updateProperty({ id, ...formData }).unwrap();
            setToast({ message: 'Cập nhật thành công', type: 'success' });
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                navigate('/admin_properties');
            }, 3000); // Quay lại danh sách sau khi cập nhật
        } catch (err) {
            console.error('EditPropertyPage: Lỗi cập nhật', err);
            setToast({ message: err?.data?.message || 'Lỗi khi cập nhật', type: 'error' });
        }
    };

    return (
        <>
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
            {
                isAnyLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        Đang tải dữ liệu...
                    </div>
                )
            }
        </div>
        </>
    );
};

export default EditPropertyPage;