import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePropertyMutation } from '../../../../api/apiSlice';
import AddPropertyForm from '../AddProperty'; // đảm bảo bạn đặt đúng path
import Toast from '../../../Toast/Toast';
import styles from '../PropertyForm.module.css';

const AddPropertyPage = () => {
    const navigate = useNavigate();
    const [createProperty] = useCreatePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });

    const handleSubmit = async (formData) => {
        try {
            console.log('AddPropertyPage: Gửi dữ liệu mới', formData);
            await createProperty(formData).unwrap();
            setToast({ message: 'Tạo bất động sản thành công', type: 'success' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                navigate('/admin_properties');
            }, 3000); 
        } catch (err) {
            console.error('AddPropertyPage: Lỗi khi tạo bất động sản', err);
            setToast({ message: err?.data?.message || 'Lỗi khi tạo mới', type: 'error' });
        }
    };

    return (
        <div className='container'>
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />
            <AddPropertyForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddPropertyPage;
