import React, { useState, useEffect } from 'react';
import styles from './PropertyForm.module.css';

const PropertyForm = ({ initialValues = {}, onSubmit }) => {
    const [form, setForm] = useState({
        title: '',
        price: '',
        area: '',
        location: '',
        longitude: '',
        latitude: '',
        type: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        description: '',
        images: [''],
        ...initialValues,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...form.images];
        newImages[index] = value;
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!form.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
        if (form.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (form.area <= 0) newErrors.area = 'Diện tích phải lớn hơn 0';
        if (form.bedrooms < 1) newErrors.bedrooms = 'Phải có ít nhất 1 phòng ngủ';
        if (form.bathrooms < 1) newErrors.bathrooms = 'Phải có ít nhất 1 phòng tắm';
        if (form.longitude < -180 || form.longitude > 180) newErrors.longitude = 'Kinh độ không hợp lệ';
        if (form.latitude < -90 || form.latitude > 90) newErrors.latitude = 'Vĩ độ không hợp lệ';

        // Regex URL đơn giản
        const urlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i;
        form.images.forEach((img, i) => {
            if (!urlRegex.test(img)) {
                newErrors[`images-${i}`] = 'URL hình ảnh không hợp lệ';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const parsedForm = {
            ...form,
            price: parseFloat(form.price),
            area: parseFloat(form.area),
            bedrooms: parseInt(form.bedrooms),
            bathrooms: parseInt(form.bathrooms),
        };
        onSubmit(parsedForm);
    };


    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Tiêu đề</label>
                    <input type="text" className={`form-control ${styles.input}`} name="title" value={form.title} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Giá</label>
                    <input type="number" className={`form-control ${styles.input}`} name="price" value={form.price} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Diện tích</label>
                    <input type="number" className={`form-control ${styles.input}`} name="area" value={form.area} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Vị trí</label>
                    <input type="text" className={`form-control ${styles.input}`} name="location" value={form.location} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Kinh độ</label>
                    <input
                        type="number"
                        className="form-control"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        required
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Vĩ độ</label>
                    <input
                        type="number"
                        className="form-control"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        required
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}

                </div>

                <div className="col-md-6">
                    <label className="form-label">Loại</label>
                    <select className={`form-select ${styles.select}`} name="type" value={form.type} onChange={handleChange}>
                        <option value="APARTMENT">Căn hộ</option>
                        <option value="HOUSE">Nhà</option>
                        <option value="LAND">Đất</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Phòng ngủ</label>
                    <input type="number" className={`form-control ${styles.input}`} name="bedrooms" value={form.bedrooms} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}

                </div>
                <div className="col-md-3">
                    <label className="form-label">Phòng tắm</label>
                    <input type="number" className={`form-control ${styles.input}`} name="bathrooms" value={form.bathrooms} onChange={handleChange} required />
                    {errors.title && <div className="text-danger">{errors.title}</div>}

                </div>
                <div className="col-12">
                    <label className="form-label">Mô tả</label>
                    <textarea className={`form-control ${styles.input}`} name="description" value={form.description} onChange={handleChange} rows={3} />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>

                <div className={`col-12 `}>
                    <label className="form-label">Hình ảnh (URL)</label>
                    {form.images.map((img, index) => (
                        <div key={index} className={`d-flex align-items-center mb-2 ${styles.imageRow}`}>
                            <input
                                type="text"
                                className="form-control me-2"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                required
                            />
                            {errors.title && <div className="text-danger">{errors.title}</div>}

                            {form.images.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImageField(index)}>X</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={addImageField}>+ Thêm hình</button>
                </div>

                <div className="col-12 text-end mt-3">
                    <button type="submit" className="btn btn-success">Lưu thay đổi</button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;
