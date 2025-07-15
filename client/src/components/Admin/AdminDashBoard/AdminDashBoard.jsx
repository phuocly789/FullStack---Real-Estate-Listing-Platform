import React, { useEffect } from 'react';
import { useGetAllUsersQuery, useGetPropertiesQuery, useGetContactsQuery, useGetProfileQuery } from '../../../api/apiSlice';
import { Link } from 'react-router-dom';
import styles from './AdminDashBoard.module.css'
const AdminDashBoard = () => {
    const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();
    const { data: propertiesJson = [], isLoading: loadingProperties } = useGetPropertiesQuery({}, { refetchOnMountOrArgChange: true });
    const { data: profile = [] } = useGetProfileQuery();
    const { data: contacts = [], isLoading: loadingContacts } = useGetContactsQuery(
        profile ? { userid: profile.userid, role: profile.role } : skipToken
    );
    const properties = propertiesJson?.properties || [];
    console.log(contacts);

    return (
        <div className="container mt-5 pt-5">
            <h2 className="mb-4">Trang Quản Trị</h2>

            {/* Cards thống kê */}
            <div className={`row mb-4` }>
                <Link to="/admin_properties" className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
                    <div className="card text-white bg-primary">
                        <div className={`card-body `}>
                            <h5 className="card-title">Tổng BĐS</h5>
                            <p className="card-text display-6">
                                {loadingProperties ? '...' : properties.length}
                            </p>
                        </div>
                    </div>
                </Link>
                <Link to={"/admin_users"} className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
                    <div className="card text-white bg-success">
                        <div className={`card-body `}>
                            <h5 className="card-title">Tổng Người Dùng</h5>
                            <p className="card-text display-6">
                                {loadingUsers ? '...' : users.length}
                            </p>
                        </div>
                    </div>
                </Link>
                <Link to={"/admin_contacts"} className={`col-md-4 col-lg-3 mb-3 ${styles.linkCard}`}>
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

            {/* Table danh sách gần đây */}
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
                                <tr><td colSpan="4">Đang tải...</td></tr>
                            ) : (
                                properties.slice(0, 5).map((property) => (
                                    <tr key={property.id}>
                                        <td>{property.title}</td>
                                        <td>{property.type}</td>
                                        <td>{property.price.toLocaleString()}đ</td>
                                        <td>{new Date(property.createdat).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="card mb-5" >
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
                                <tr><td colSpan="4">Đang tải...</td></tr>
                            ) : (
                                users.slice(0, 5).map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
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
                            {loadingProperties ? (
                                <tr><td colSpan="4">Đang tải...</td></tr>
                            ) : (
                                contacts.slice(0, 5).map((contact) => (
                                    <tr key={contact.id}>
                                        <td>{contact.User.name}</td>
                                        <td>{contact.User.email}</td>
                                        <td>{contact.property.title}</td>
                                        <td>{contact.message}</td>
                                        <td>{contact.status}</td>
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
