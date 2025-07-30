import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PropertyForm.module.css';

const EditPropertyForm = ({ initialValues = {}, onSubmit }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: initialValues.id || '',
        title: initialValues.title || '',
        price: initialValues.price || '',
        area: initialValues.area || '',
        province: '',
        district: '',
        ward: '',
        location: initialValues.location || '',
        longitude: initialValues.longitude || '',
        latitude: initialValues.latitude || '',
        type: initialValues.type || 'APARTMENT',
        bedrooms: initialValues.bedrooms || 1,
        bathrooms: initialValues.bathrooms || 1,
        description: initialValues.description || '',
        images: Array.isArray(initialValues.images) && initialValues.images.length > 0 ? initialValues.images : [''],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false); // Biến để theo dõi trạng thái khởi tạo

    console.log('EditPropertyForm: initialValues', initialValues);
    console.log('EditPropertyForm: form state', form);

    const MAX_IMAGES = 10;
    const MAX_TITLE_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 500;
    const MAX_PRICE = 100000000000; // 100 tỷ
    const MAX_AREA = 1000; // 1 km²

    // Hàm chuẩn hóa tên
    const normalizeName = (name) =>
        name
            .toLowerCase()
            .replace(/đ/g, 'd')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

    // Hàm khởi tạo location fields
    const initializeLocationFields = async (location) => {
        if (!location || typeof location !== 'string') {
            console.log('initializeLocationFields: Location không hợp lệ', { location });
            return;
        }

        setLoading(true);
        try {
            const parts = location.split(',').map((part) => part.trim());
            if (parts.length < 2) {
                setErrors((prev) => ({ ...prev, api: 'Định dạng địa chỉ không hợp lệ' }));
                return;
            }

            const wardName = parts.length >= 3 ? parts[0] : '';
            const districtName = parts[parts.length - 2];
            const provinceName = parts[parts.length - 1];

            const provinceRes = await fetch('https://provinces.open-api.vn/api/p/');
            const provincesData = await provinceRes.json();
            const cleanedProvinceName = provinceName.replace(/^(Tỉnh|Thành phố)\s+/i, '');
            const normalizedProvinceName = normalizeName(cleanedProvinceName);
            const province = provincesData.find((p) => {
                const cleanedAPIName = p.name.replace(/^(Tỉnh|Thành phố)\s+/i, '');
                return normalizeName(cleanedAPIName) === normalizedProvinceName;
            });

            if (!province) {
                setErrors((prev) => ({ ...prev, api: `Không tìm thấy tỉnh/thành phố: ${provinceName}` }));
                return;
            }

            setForm((prev) => ({ ...prev, province: province.code.toString() }));
            const districtRes = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
            const provinceData = await districtRes.json();
            const cleanedDistrictName = districtName.replace(/^Thành phố\s+/i, '');
            const normalizedDistrictName = normalizeName(cleanedDistrictName);
            const district = provinceData.districts.find((d) => {
                const cleanedAPIDistrictName = d.name.replace(/^Thành phố\s+/i, '');
                return normalizeName(cleanedAPIDistrictName) === normalizedDistrictName;
            });

            if (!district) {
                setErrors((prev) => ({ ...prev, api: `Không tìm thấy quận/huyện: ${districtName}` }));
                return;
            }

            setDistricts(provinceData.districts || []);
            setForm((prev) => ({ ...prev, district: district.code.toString() }));

            if (wardName) {
                const wardRes = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                const districtData = await wardRes.json();
                const normalizedWardName = normalizeName(wardName);
                const ward = districtData.wards.find((w) => normalizeName(w.name) === normalizedWardName);

                if (!ward) {
                    setErrors((prev) => ({ ...prev, api: `Không tìm thấy phường/xã: ${wardName}` }));
                    return;
                }

                setWards(districtData.wards || []);
                setForm((prev) => ({ ...prev, ward: ward.code.toString() }));
            } else {
                const wardRes = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                const districtData = await wardRes.json();
                setWards(districtData.wards || []);
            }
        } catch (error) {
            console.error('initializeLocationFields: Lỗi', { error });
            setErrors((prev) => ({ ...prev, api: 'Không thể khởi tạo địa chỉ' }));
        } finally {
            setLoading(false);
        }
    };

    // Tải danh sách tỉnh và khởi tạo location
    useEffect(() => {
        if (initialized.current) return; // Ngăn gọi lại nếu đã khởi tạo
        initialized.current = true;

        fetch('https://provinces.open-api.vn/api/p/')
            .then((response) => response.json())
            .then((data) => {
                setProvinces(data);
                if (initialValues.location) {
                    initializeLocationFields(initialValues.location);
                }
            })
            .catch((error) => {
                console.error('useEffect: Lỗi tải tỉnh', { error });
                setErrors((prev) => ({ ...prev, api: 'Không thể tải danh sách tỉnh' }));
            });
    }, []); // Chỉ chạy một lần khi component mount

    // Tải quận/huyện khi tỉnh thay đổi
    useEffect(() => {
        if (!form.province || loading) return;

        setLoading(true);
        const abortController = new AbortController();
        fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`, {
            signal: abortController.signal,
        })
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
            .catch((error) => {
                if (error.name === 'AbortError') return;
                console.error('useEffect: Lỗi tải quận/huyện', { error });
                setErrors((prev) => ({ ...prev, api: 'Không thể tải quận/huyện' }));
                setLoading(false);
            });

        return () => abortController.abort();
    }, [form.province]);

    // Tải phường/xã khi quận/huyện thay đổi
    useEffect(() => {
        if (!form.district || loading) return;

        setLoading(true);
        const abortController = new AbortController();
        fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`, {
            signal: abortController.signal,
        })
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
            .catch((error) => {
                if (error.name === 'AbortError') return;
                console.error('useEffect: Lỗi tải phường/xã', { error });
                setErrors((prev) => ({ ...prev, api: 'Không thể tải phường/xã' }));
                setLoading(false);
            });

        return () => abortController.abort();
    }, [form.district]);

    // Cập nhật location và tọa độ
    useEffect(() => {
        if (!form.province || !form.district || !form.ward || wards.length === 0 || loading) return;

        const ward = wards.find((w) => w.code === parseInt(form.ward));
        if (!ward) return;

        const province = provinces.find((p) => p.code === parseInt(form.province))?.name || '';
        const district = districts.find((d) => d.code === parseInt(form.district))?.name || '';
        const wardName = ward.name || '';
        const location = `${wardName}, ${district}, ${province}`;
        setForm((prev) => ({ ...prev, location }));

        setLoading(true);
        const abortController = new AbortController();
        const address = `${wardName}, ${district}, ${province}, Vietnam`;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
            headers: { 'User-Agent': 'PropertyFormApp/1.0 (your-email@example.com)' },
            signal: abortController.signal,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    setForm((prev) => ({
                        ...prev,
                        longitude: data[0].lon,
                        latitude: data[0].lat,
                    }));
                    setLoading(false);
                } else {
                    const fallbackAddress = `${district}, ${province}, Vietnam`;
                    fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}`,
                        {
                            headers: { 'User-Agent': 'PropertyFormApp/1.0 (your-email@example.com)' },
                            signal: abortController.signal,
                        }
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
                        .catch((error) => {
                            if (error.name === 'AbortError') return;
                            setErrors((prev) => ({
                                ...prev,
                                api: `Lỗi tọa độ: ${fallbackAddress}`,
                            }));
                            setLoading(false);
                        });
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;
                setErrors((prev) => ({
                    ...prev,
                    api: `Lỗi tọa độ: ${address}`,
                }));
                setLoading(false);
            });

        return () => abortController.abort();
    }, [form.province, form.district, form.ward]);

    // Xóa lỗi API sau 3 giây
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

    // Xóa useEffect đồng bộ initialValues
    // Thay bằng cập nhật thủ công khi initialValues thay đổi
    useEffect(() => {
        if (!initialized.current && Object.keys(initialValues).length > 0) {
            setForm((prev) => ({
                ...prev,
                id: initialValues.id || prev.id,
                title: initialValues.title || prev.title,
                price: initialValues.price || prev.price,
                area: initialValues.area || prev.area,
                location: initialValues.location || prev.location,
                longitude: initialValues.longitude || prev.longitude,
                latitude: initialValues.latitude || prev.latitude,
                type: initialValues.type || prev.type,
                bedrooms: initialValues.bedrooms || prev.bedrooms,
                bathrooms: initialValues.bathrooms || prev.bathrooms,
                description: initialValues.description || prev.description,
                images:
                    Array.isArray(initialValues.images) && initialValues.images.length > 0
                        ? initialValues.images
                        : prev.images,
            }));
        }
    }, [initialValues]);

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
        if (form.price && parseFloat(form.price) > MAX_PRICE) newErrors.price = 'Giá không được vượt quá 100 tỷ';
        if (!form.area || parseFloat(form.area) <= 0) newErrors.area = 'Diện tích phải lớn hơn 0';
        if (form.area && parseFloat(form.area) > MAX_AREA) newErrors.area = 'Diện tích không được vượt quá 1 nghìn m²';
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
            id: form.id,
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

    const formatPrice = (price) => {
        if (!price || isNaN(price)) return '0 / 100 tỷ';

        const value = parseFloat(price);
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000)} tỷ / 100 tỷ`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000)} triệu / 100,000 triệu`;
        } else if (value >= 1_000) {
            return `${(value / 1_000)} nghìn / 100,000,000 nghìn`;
        } else {
            return `${value} VNĐ / 100,000,000,000 VNĐ`;
        }
    };
    return (
        <div className={styles.formContainer}>
            <h2 className='mb-5'>Chỉnh Sửa Bất Động Sản</h2>
            {isAnyLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    Đang tải dữ liệu...
                </div>
            )}
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
                    <small className="text-muted">{formatPrice(form.price)}</small>
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
                        max={1000}
                    />
                    <small className="text-muted">
                        {form.area ? `${(parseFloat(form.area))} m² / 1000 m²` : '0 / 1000 m²'}
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
                        {wards.length > 0 ? (
                            wards.map((ward) => (
                                <option key={ward.code} value={ward.code.toString()}>
                                    {ward.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                Không có phường/xã
                            </option>
                        )}
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
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPropertyForm;