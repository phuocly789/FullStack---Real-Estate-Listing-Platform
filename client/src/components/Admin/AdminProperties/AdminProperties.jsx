import React, { useEffect, useState } from 'react';
import { useDeletePropertyMutation, useGetPropertiesQuery } from '../../../api/apiSlice';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import styles from './AdminProperties.module.css';
import Toast from '../../Toast/Toast';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';

const AdminProperties = () => {
    const [page, setPage] = useState(1);
    const [isDebouncing, setIsDebouncing] = useState(false); // Thêm trạng thái debounce
    const limit = 8;

    const { data = [], isLoading: loadingProperties, error, refetch } = useGetPropertiesQuery(
        { page, limit, createdAtSort: 'desc' },
        { refetchOnMountOrArgChange: true }
    );
    const properties = data?.properties || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const navigate = useNavigate();
    const [deleteProperty, { isLoading: loadingDelete }] = useDeletePropertyMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !loadingProperties && !loadingDelete && !isDebouncing) {
            setIsDebouncing(true); // Bắt đầu debounce
            setPage(newPage);
            setTimeout(() => {
                setIsDebouncing(false); // Reset debounce sau 300ms
            }, 300);
        }
    };

    useEffect(() => {
        if (error) {
            setToast({ message: 'Lỗi khi tải dữ liệu: ' + (error?.data?.message || error.message), type: 'error' });
        }
    }, [error]);

    const handleEdit = (id) => {
        navigate(`/admin_properties/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await deleteProperty(selectedId).unwrap();
            setToast({ message: 'Xóa Thành Công', type: 'success' });
            setIsSuccess(true);
            setShowConfirm(false);
            refetch();
            setTimeout(() => {
                setToast({ message: '', type: '' });
                setIsSuccess(null);
            }, 3000);
        } catch (err) {
            setToast({ message: err?.data?.message || err.message, type: 'error' });
            setIsSuccess(false);
        }
    };

    const openConfirmModal = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const SkeletonRow = () => (
        <tr>
            {Array(11).fill().map((_, index) => (
                <td key={index} className={styles.skeletonCell}>
                    <div className={styles.skeleton}></div>
                </td>
            ))}
        </tr>
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`btn mx-1 ${i === page ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handlePageChange(i)}
                        disabled={loadingProperties || loadingDelete || isDebouncing}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            pages.push(
                <button
                    key={1}
                    className={`btn mx-1 ${1 === page ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageChange(1)}
                    disabled={loadingProperties || loadingDelete || isDebouncing}
                >
                    1
                </button>
            );

            if (page > 3) {
                pages.push(<span key="ellipsis-start" className="mx-2">...</span>);
            }

            const startPage = Math.max(2, page - 1);
            const endPage = Math.min(totalPages - 1, page + 1);
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`btn mx-1 ${i === page ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handlePageChange(i)}
                        disabled={loadingProperties || loadingDelete || isDebouncing}
                    >
                        {i}
                    </button>
                );
            }

            if (page < totalPages - 2) {
                pages.push(<span key="ellipsis-end" className="mx-2">...</span>);
            }

            pages.push(
                <button
                    key={totalPages}
                    className={`btn mx-1 ${totalPages === page ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={loadingProperties || loadingDelete || isDebouncing}
                >
                    {totalPages}
                </button>
            );
        }

        return (
            <div className="d-flex justify-content-center my-4 align-items-center">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    className="btn btn-outline-primary mx-2"
                    disabled={page === 1 || loadingProperties || loadingDelete || isDebouncing}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#1f1f1f"
                    >
                        <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
                    </svg>
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className="btn btn-outline-primary mx-2"
                    disabled={page === totalPages || loadingProperties || loadingDelete || isDebouncing}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#1f1f1f"
                    >
                        <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                {(loadingProperties || loadingDelete) && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
                <h2 className="mb-4">Trang Quản Trị Properties</h2>
                <div className="row mb-4">
                    <Link to="/admin/properties" className="col-md-4 col-lg-3 mb-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5 className="card-title">Tổng BĐS</h5>
                                <p className="card-text display-6">
                                    {loadingProperties ? '...' : totalCount}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <Toast
                    message={toast.message}
                    type={toast.type}
                    isSuccess={isSuccess}
                    onClose={() => {
                        setToast({ message: '', type: '' });
                        setIsSuccess(null);
                    }}
                />

                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <strong>Danh sách BĐS</strong>
                        <Link to="/admin_properties/add" className="btn btn-success">
                            + Thêm Bất Động Sản
                        </Link>
                    </div>
                    <div className="card-body table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Tiêu đề</th>
                                    <th>Loại</th>
                                    <th>Diện tích</th>
                                    <th>Vị trí</th>
                                    <th>Hình ảnh</th>
                                    <th>Phòng ngủ</th>
                                    <th>Phòng tắm</th>
                                    <th>Mô tả</th>
                                    <th>Giá</th>
                                    <th>Ngày tạo</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingProperties ? (
                                    Array(limit).fill().map((_, index) => <SkeletonRow key={index} />)
                                ) : properties.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="text-center">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    properties.map((property) => (
                                        <tr key={property.id} className={styles.fadeInRow}>
                                            <td>{truncateText(property.title, 40)}</td>
                                            <td>{property.type}</td>
                                            <td>{property.area} m²</td>
                                            <td>{truncateText(property.location, 20)}</td>
                                            <td className={styles.img}>
                                                <img src={property.images[0]} alt="" />
                                            </td>
                                            <td>{property.bedrooms}</td>
                                            <td>{property.bathrooms}</td>
                                            <td className={styles.description}>
                                                {truncateText(property.description, 20)}
                                            </td>
                                            <td>{truncateText(property.price.toLocaleString(), 20)}đ</td>
                                            <td>
                                                {property.createdat
                                                    ? new Date(property.createdat).toLocaleDateString('vi-VN')
                                                    : 'Không có thời gian'}
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    <button
                                                        className={styles.actionButton}
                                                        title="Chỉnh sửa"
                                                        onClick={() => handleEdit(property.id)}
                                                        disabled={loadingProperties || loadingDelete}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="20px"
                                                            viewBox="0 -960 960 960"
                                                            width="20px"
                                                            fill="#FFC107"
                                                        >
                                                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className={styles.actionButton}
                                                        title="Xoá"
                                                        onClick={() => openConfirmModal(property.id)}
                                                        disabled={loadingProperties || loadingDelete}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="20px"
                                                            viewBox="0 -960 960 960"
                                                            width="20px"
                                                            fill="#DC3545"
                                                        >
                                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {renderPagination()}
            </div>

            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                message="Bạn có chắc chắn muốn xoá bất động sản này?"
            />
            <Footer />
        </>
    );
};

export default AdminProperties;