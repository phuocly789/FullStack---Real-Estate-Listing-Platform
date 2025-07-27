import React, { useEffect } from 'react';
import { useGetAllUsersQuery, useGetPropertiesQuery, useGetContactsQuery, useGetProfileQuery } from '../../../api/apiSlice';
import { Link } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import styles from './AdminDashBoard.module.css';

const AdminDashBoard = () => {
    const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery(
        { page: 1, limit: 5, sort: '-createdAt' }
    );
    const { data: propertiesJson = {}, isLoading: loadingProperties } = useGetPropertiesQuery(
        { page: 1, limit: 5, createdAtSort: 'desc' }
    );
    const { data: profile = {} } = useGetProfileQuery();
    const { data: contacts = [], isLoading: loadingContacts } = useGetContactsQuery(
        profile ? { userid: profile.userid, role: profile.role } : skipToken
    );
    const properties = propertiesJson?.properties || [];

    // Kiểm tra trạng thái loading tổng thể
    const isAnyLoading = loadingUsers || loadingProperties || loadingContacts;

    // Hàm rút gọn văn bản
    const truncateText = (text, maxLength) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className={`container mt-5 pt-5 ${styles.container}`}>
            {/* Hiệu ứng loading toàn màn hình */}
            {isAnyLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            <h2 className="mb-4">Trang Quản Trị</h2>

            {/* Cards thống kê */}
            <div className={`row mb-4`}>
                <Link to="/admin_properties" className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
                    <div className="card text-white bg-primary">
                        <div className={`card-body`}>
                            <h5 className="card-title">Tổng BĐS</h5>
                            <p className="card-text display-6">
                                {loadingProperties ? '...' : propertiesJson?.totalCount}
                            </p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin_users" className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
                    <div className="card text-white bg-success">
                        <div className={`card-body`}>
                            <h5 className="card-title">Tổng Người Dùng</h5>
                            <p className="card-text display-6">
                                {loadingUsers ? '...' : users.length}
                            </p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin_contacts" className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
                    <div className="card text-white bg-warning">
                        <div className={`card-body`}>
                            <h5 className="card-title">Tổng Báo Cáo</h5>
                            <p className="card-text display-6">
                                {loadingContacts ? '...' : contacts.length}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Table danh sách BĐS mới nhất */}
            <div className="card mb-5">
                <div className="card-header">
                    <strong>Danh sách BĐS mới nhất</strong>
                </div>
                <div className="card-body table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>Loại</th>
                                <th>Giá</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingProperties ? (
                                <tr><td colSpan="4" className="text-center">Đang tải...</td></tr>
                            ) : properties.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">Không có dữ liệu</td></tr>
                            ) : (
                                properties
                                    .slice()
                                    .sort((a, b) => new Date(b.createdat) - new Date(a.createdat))
                                    .slice(0, 5)
                                    .map((property) => (
                                        <tr key={property.id}>
                                            <td>{truncateText(property.title, 30)}</td>
                                            <td>{property.type}</td>
                                            <td>{truncateText(property.price.toLocaleString(), 20)}đ</td>
                                            <td>
                                                {property.createdat
                                                    ? new Date(property.createdat).toLocaleDateString('vi-VN')
                                                    : 'Không có thời gian'}
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table danh sách User đăng ký mới */}
            <div className="card mb-5">
                <div className="card-header">
                    <strong>Danh sách User đăng ký mới</strong>
                </div>
                <div className="card-body table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingUsers ? (
                                <tr><td colSpan="4" className="text-center">Đang tải...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">Không có dữ liệu</td></tr>
                            ) : (
                                users
                                    .slice()
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 5)
                                    .map((user) => (
                                        <tr key={user.id}>
                                            <td>{truncateText(user.name, 20)}</td>
                                            <td>{truncateText(user.email, 30)}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                                                    : 'Không có thời gian'}
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table danh sách Contacts mới nhất */}
            <div className="card mb-5">
                <div className="card-header">
                    <strong>Danh sách Contacts mới nhất</strong>
                </div>
                <div className="card-body table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>BĐS</th>
                                <th>Nội Dung</th>
                                <th>Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingContacts ? (
                                <tr><td colSpan="5" className="text-center">Đang tải...</td></tr>
                            ) : contacts.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">Không có dữ liệu</td></tr>
                            ) : (
                                [...contacts]
                                    .sort((a, b) => {
                                        if (a.status !== b.status) {
                                            return a.status === 'PENDING' ? -1 : 1;
                                        }
                                        return new Date(b.createdat) - new Date(a.createdat);
                                    })
                                    .slice()
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 5)
                                    .map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{truncateText(contact.User?.name, 20)}</td>
                                            <td>{truncateText(contact.User?.email, 30)}</td>
                                            <td>{truncateText(contact.property?.title, 40)}</td>
                                            <td>{truncateText(contact.message, 50)}</td>
                                            <td>
                                                <span
                                                    className={
                                                        contact.status === 'PENDING'
                                                            ? styles.statusPending
                                                            : contact.status === 'RESPONDED'
                                                                ? styles.statusResponded
                                                                : styles.statusClosed
                                                    }
                                                >
                                                    {contact.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashBoard;