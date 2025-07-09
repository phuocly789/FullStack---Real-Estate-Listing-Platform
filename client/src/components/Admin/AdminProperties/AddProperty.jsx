import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePropertyMutation } from '../../../api/apiSlice';
import PropertyForm from './PropertyForm';
import Toast from '../../Toast/Toast';

const AddProperty = () => {
    const [createProperty] = useCreatePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            await createProperty(values).unwrap();
            setToast({ message: 'Thêm BĐS thành công!', type: 'success' });
            setTimeout(() => navigate('/admin_properties'), 1500);
        } catch (err) {
            setToast({
                message: 'Lỗi khi thêm BĐS: ' + (err?.data?.message || err.message),
                type: 'error',
            });
        }
    };

    return (
        <div className="container mt-5 pt-4">
            <h2>Thêm Bất Động Sản Mới</h2>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />

            <PropertyForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddProperty;
