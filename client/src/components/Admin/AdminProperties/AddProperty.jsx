import React, { useState, useEffect } from 'react';
import styles from './PropertyForm.module.css';

const AddPropertyForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        title: '',
        price: '',
        area: '',
        province: '',
        district: '',
        ward: '',
        location: '',
        longitude: '',
        latitude: '',
        type: 'APARTMENT',
        bedrooms: 1,
        bathrooms: 1,
        description: '',
        images: [''],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    const MAX_IMAGES = 10;
    const MAX_TITLE_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 500;
    const MAX_PRICE = 999000000000; // 999 tỷ
    const MAX_AREA = 999000000; // 999 km² = 999,000,000 m²

    // Lấy danh sách tỉnh khi component mount
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then((response) => response.json())
            .then((data) => setProvinces(data))
            .catch(() => setErrors((prev) => ({ ...prev, api: 'Không thể tải danh sách tỉnh' })));
    }, []);

    // Lấy danh sách quận/huyện khi tỉnh thay đổi
    useEffect(() => {
        if (form.province) {
            setLoading(true);
            fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
                .then((response) => response.json())
                .then((data) => {
                    setDistricts(data.districts || []);
                    setForm((prev) => ({
                        ...prev,
                        district: '',
                        ward: '',
                        location: '',
                        longitude: '',
                        latitude: '',
                    }));
                    setWards([]);
                    setLoading(false);
                })
                .catch(() => {
                    setErrors((prev) => ({ ...prev, api: 'Không thể tải danh sách quận/huyện' }));
                    setLoading(false);
                });
        } else {
            setDistricts([]);
            setWards([]);
            setForm((prev) => ({
                ...prev,
                district: '',
                ward: '',
                location: '',
                longitude: '',
                latitude: '',
            }));
        }
    }, [form.province]);

    // Lấy danh sách phường/xã khi quận/huyện thay đổi
    useEffect(() => {
        if (form.district) {
            setLoading(true);
            fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
                .then((response) => response.json())
                .then((data) => {
                    setWards(data.wards || []);
                    setForm((prev) => ({
                        ...prev,
                        ward: '',
                        location: '',
                        longitude: '',
                        latitude: '',
                    }));
                    setLoading(false);
                })
                .catch(() => {
                    setErrors((prev) => ({ ...prev, api: 'Không thể tải danh sách phường/xã' }));
                    setLoading(false);
                });
        } else {
            setWards([]);
            setForm((prev) => ({
                ...prev,
                ward: '',
                location: '',
                longitude: '',
                latitude: '',
            }));
        }
    }, [form.district]);

    // Cập nhật location và tọa độ khi province, district, ward thay đổi
    useEffect(() => {
        if (form.province && form.district && form.ward && wards.length > 0) {
            const ward = wards.find((w) => w.code === parseInt(form.ward));
            if (!ward) return;
            const province = provinces.find((p) => p.code === parseInt(form.province))?.name || '';
            const district = districts.find((d) => d.code === parseInt(form.district))?.name || '';
            const wardName = ward.name || '';
            const location = `${wardName}, ${district}, ${province}`;
            setForm((prev) => ({ ...prev, location }));

            setLoading(true);
            const address = `${wardName}, ${district}, ${province}, Vietnam`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
                headers: { 'User-Agent': 'PropertyFormApp/1.0 (your-email@example.com)' },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        setForm((prev) => ({
                            ...prev,
                            longitude: data[0].lon,
                            latitude: data[0].lat,
                        }));
                    } else {
                        const fallbackAddress = `${district}, ${province}, Vietnam`;
                        fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}`,
                            { headers: { 'User-Agent': 'PropertyFormApp/1.0 (your-email@example.com)' } }
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.length > 0) {
                                    setForm((prev) => ({
                                        ...prev,
                                        longitude: data[0].lon,
                                        latitude: data[0].lat,
                                    }));
                                } else {
                                    setErrors((prev) => ({
                                        ...prev,
                                        api: `Không thể tìm tọa độ cho địa chỉ: ${address}`,
                                    }));
                                }
                                setLoading(false);
                            })
                            .catch(() => {
                                setErrors((prev) => ({
                                    ...prev,
                                    api: `Lỗi khi lấy tọa độ cho địa chỉ: ${fallbackAddress}`,
                                }));
                                setLoading(false);
                            });
                    }
                })
                .catch(() => {
                    setErrors((prev) => ({
                        ...prev,
                        api: `Lỗi khi lấy tọa độ cho địa chỉ: ${address}`,
                    }));
                    setLoading(false);
                });
        }
    }, [form.province, form.district, form.ward, provinces, districts, wards]);

    // Tự động xóa thông báo lỗi API sau 3 giây
    useEffect(() => {
        if (errors.api) {
            const timer = setTimeout(() => {
                setErrors((prev) => {
                    const { api, ...rest } = prev;
                    return rest;
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors.api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length > MAX_TITLE_LENGTH) return;
        if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) return;
        if (name === 'price' && value && parseFloat(value) > MAX_PRICE) return;
        if (name === 'area' && value && parseFloat(value) > MAX_AREA) return;

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...form.images];
        newImages[index] = value;
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        if (form.images.length >= MAX_IMAGES) {
            setErrors((prev) => ({
                ...prev,
                images: `Không thể thêm quá ${MAX_IMAGES} hình ảnh`,
            }));
            return;
        }
        setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
        if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (form.price && parseFloat(form.price) > MAX_PRICE) newErrors.price = 'Giá không được vượt quá 999 tỷ';
        if (!form.area || parseFloat(form.area) <= 0) newErrors.area = 'Diện tích phải lớn hơn 0';
        if (form.area && parseFloat(form.area) > MAX_AREA) newErrors.area = 'Diện tích không được vượt quá 999 triệu m²';
        if (!form.province) newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
        if (!form.district) newErrors.district = 'Vui lòng chọn quận/huyện';
        if (!form.ward) newErrors.ward = 'Vui lòng chọn phường/xã';
        if (!form.location) newErrors.location = 'Địa chỉ không hợp lệ';
        if (!form.longitude || form.longitude < -180 || form.longitude > 180)
            newErrors.longitude = 'Kinh độ không hợp lệ';
        if (!form.latitude || form.latitude < -90 || form.latitude > 90) newErrors.latitude = 'Vĩ độ không hợp lệ';

        const urlRegex = /.*\.(jpg|jpeg|png|webp|gif)$/i;
        form.images.forEach((img, i) => {
            if (img.trim() === '') newErrors[`images-${i}`] = 'URL hình ảnh không được để trống';
            else if (!urlRegex.test(img)) newErrors[`images-${i}`] = 'URL hình ảnh không hợp lệ';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting || loading) return;
        if (!validate()) return;

        setIsSubmitting(true);
        const parsedForm = {
            title: form.title,
            price: parseFloat(form.price),
            area: parseFloat(form.area),
            location: form.location,
            longitude: parseFloat(form.longitude) || 0,
            latitude: parseFloat(form.latitude) || 0,
            type: form.type,
            bedrooms: parseInt(form.bedrooms),
            bathrooms: parseInt(form.bathrooms),
            description: form.description,
            images: form.images.filter((img) => img.trim() !== ''),
        };

        onSubmit(parsedForm);
        setTimeout(() => setIsSubmitting(false), 1000);
    };
    const isAnyLoading = loading || isSubmitting;
    return (
        <div className={styles.formContainer}>
            <h2 className='mb-5 '>Thêm Bất Động Sản</h2>
            {
                isAnyLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        Đang tải dữ liệu...
                    </div>
                )
            }
            {errors.api && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errors.api}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setErrors((prev) => {
                            const { api, ...rest } = prev;
                            return rest;
                        })}
                    ></button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Tiêu đề</label>
                    <input
                        type="text"
                        className={`form-control ${styles.input}`}
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={MAX_TITLE_LENGTH}
                        required
                    />
                    <small className="text-muted">{form.title.length}/{MAX_TITLE_LENGTH} ký tự</small>
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                    <small className="text-muted">
                        {form.price ? `${(parseFloat(form.price) / 1000000000).toFixed(2)} tỷ / 999 tỷ` : '0 / 999 tỷ'}
                    </small>
                    {errors.price && <div className="text-danger">{errors.price}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Diện tích (m²)</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        required
                    />
                    <small className="text-muted">
                        {form.area ? `${(parseFloat(form.area) / 1000000).toFixed(2)} km² / 999 km²` : '0 / 999 km²'}
                    </small>
                    {errors.area && <div className="text-danger">{errors.area}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Loại</label>
                    <select
                        className={`form-select ${styles.select}`}
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="APARTMENT">Căn hộ</option>
                        <option value="HOUSE">Nhà</option>
                        <option value="LAND">Đất</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Tỉnh/Thành phố</label>
                    <select
                        className={`form-select ${styles.select}`}
                        name="province"
                        value={form.province}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((prov) => (
                            <option key={prov.code} value={prov.code}>{prov.name}</option>
                        ))}
                    </select>
                    {errors.province && <div className="text-danger">{errors.province}</div>}
                </div>
                <div className="col-md-4">
                    <label className="form-label">Quận/Huyện</label>
                    <select
                        className={`form-select ${styles.select}`}
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        required
                        disabled={loading || !form.province}
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((dist) => (
                            <option key={dist.code} value={dist.code}>{dist.name}</option>
                        ))}
                    </select>
                    {errors.district && <div className="text-danger">{errors.district}</div>}
                </div>
                <div className="col-md-4">
                    <label className="form-label">Phường/Xã</label>
                    <select
                        className={`form-select ${styles.select}`}
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        required
                        disabled={loading || !form.district}
                    >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>{ward.name}</option>
                        ))}
                    </select>
                    {errors.ward && <div className="text-danger">{errors.ward}</div>}
                </div>
                <div className="col-12">
                    <label className="form-label">Địa chỉ</label>
                    <input
                        type="text"
                        className={`form-control ${styles.input}`}
                        name="location"
                        value={form.location}
                        readOnly
                    />
                    {errors.location && <div className="text-danger">{errors.location}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Kinh độ</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="longitude"
                        value={form.longitude}
                        readOnly
                    />
                    {errors.longitude && <div className="text-danger">{errors.longitude}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Vĩ độ</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="latitude"
                        value={form.latitude}
                        readOnly
                    />
                    {errors.latitude && <div className="text-danger">{errors.latitude}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Phòng ngủ</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="bedrooms"
                        value={form.bedrooms}
                        onChange={handleChange}
                        required
                    />
                    {errors.bedrooms && <div className="text-danger">{errors.bedrooms}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label">Phòng tắm</label>
                    <input
                        type="number"
                        className={`form-control ${styles.input}`}
                        name="bathrooms"
                        value={form.bathrooms}
                        onChange={handleChange}
                        required
                    />
                    {errors.bathrooms && <div className="text-danger">{errors.bathrooms}</div>}
                </div>
                <div className="col-12">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className={`form-control ${styles.input}`}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                    />
                    <small className="text-muted">{form.description.length}/{MAX_DESCRIPTION_LENGTH} ký tự</small>
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>
                <div className="col-12">
                    <label className="form-label">Hình ảnh (URL)</label>
                    {form.images.map((img, index) => (
                        <div key={index} className={`d-flex align-items-center mb-2 ${styles.imageRow}`}>
                            <input
                                type="text"
                                className={`form-control ${styles.input} me-2`}
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                required
                            />
                            {form.images.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeImageField(index)}
                                >
                                    X
                                </button>
                            )}
                            {errors[`images-${index}`] && (
                                <div className="text-danger mt-1">{errors[`images-${index}`]}</div>
                            )}
                        </div>
                    ))}
                    {errors.images && <div className="text-danger mb-2">{errors.images}</div>}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-1"
                        onClick={addImageField}
                        disabled={form.images.length >= MAX_IMAGES}
                    >
                        + Thêm hình
                    </button>
                </div>
                <div className="col-12 d-flex justify-content-between mt-3">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Quay về
                    </button>
                    <button type="submit" className="btn btn-success" disabled={isSubmitting || loading}>
                        {!isSubmitting && 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertyForm;