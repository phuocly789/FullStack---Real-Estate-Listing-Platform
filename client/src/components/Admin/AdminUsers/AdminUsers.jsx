import React, { useEffect, useState } from 'react';
import { useDeleteAccountMutation, useDeleteUserMutation, useGetAllUsersQuery, useGetProfileQuery } from '../../../api/apiSlice';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import Toast from '../../Toast/Toast';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import styles from './AdminUsers.module.css'
const AdminUsers = () => {
    const { data: users = [], isLoading: loadingUsers, refetch } = useGetAllUsersQuery();
    const { data: currentUser } = useGetProfileQuery();
    // const navigate = useNavigate();
    const [deleteuser] = useDeleteUserMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(null);
    // //
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const openConfirmModal = (id) => {
        if (id === currentUser?.id) {
            setToast({
                message: 'Không thể tự xoá chính mình!',
                type: 'error'
            });
            setIsSuccess(false);
            return;
        }
        setSelectedId(id);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await deleteuser(selectedId).unwrap();
            setToast({
                message: 'Xóa Thành Công',
                type: 'success',
            });
            setIsSuccess(true);
            setShowConfirm(false);
            refetch();
        } catch (err) {
            setToast({
                message: err?.data?.message || err.message,
                type: 'error',
            });
            setIsSuccess(false);
        }
    };
    // console.log(users[0].avatar)
    return (

        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                <h2 className="mb-4">Trang Quản Trị Users</h2>
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isSuccess={isSuccess}
                    onClose={() => {
                        setToast({ message: '', type: '' });
                        setIsSuccess(null);
                    }}
                />
                <div className="row mb-4">
                    <div className="col-md-4 col-lg-3 mb-3">
                        <div className={`card text-white bg-warning ${styles.card}`}>
                            <div className="card-body">
                                <h5 className="card-title">Tổng User</h5>
                                <p className="card-text display-6">
                                    {loadingUsers ? '...' : users.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Cards thống kê */}
                <div className="row mb-4">


                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <strong>Danh sách Users</strong>

                        </div>
                        <div className="card-body table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Avatar</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Thời gian tạo</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingUsers ? (
                                        <tr><td>Đang tải...</td></tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className={styles.fadeInRow}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td className={styles.img}><img src={user.avatar} alt="" /></td>
                                                <td>{user.phone}</td>
                                                <td>{user.role}</td>
                                                <td>{user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                                                    : 'Không có thời gian'}
                                                </td>
                                                <td>
                                                    <div className={styles.actionButtons}>
                                                        <button className={styles.actionButton} title="Xoá" onClick={() => openConfirmModal(user.id)}>
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
                </div>
                {/* <div className="d-flex justify-content-center my-4">
                    {totalPages > 1 && (
                        <button onClick={handlePrevPage} className="btn btn-outline-primary mx-2" disabled={page === 1}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#1f1f1f"
                            >
                                <path
                                    d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"
                                />
                            </svg>

                        </button>
                    )}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                className={`btn mx-1 ${pageNumber === page ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    {totalPages > 1 && (
                        <button onClick={handleNextPage} className="btn btn-outline-primary mx-2" disabled={users.length < limit}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px" viewBox="0 -960 960 960"
                                width="24px" fill="#1f1f1f"
                            >
                                <path
                                    d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"
                                />
                            </svg>
                        </button>
                    )}
                </div> */}
            </div>
            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                message="Bạn có chắc chắn muốn xoá người dùng này?"
            />

            <Footer />
        </>
    );
};

export default AdminUsers;
