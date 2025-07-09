import React, { useEffect } from 'react';
import { useGetAllUsersQuery, useGetPropertiesQuery, useGetContactsQuery, useGetProfileQuery } from '../../../api/apiSlice';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';

const AdminProperties = () => {
    const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();
    const { data: propertiesJson = [], isLoading: loadingProperties } = useGetPropertiesQuery({}, { refetchOnMountOrArgChange: true });
    const { data: profile = [] } = useGetProfileQuery();
    const { data: contacts = [], isLoading: loadingContacts } = useGetContactsQuery(
        profile ? { userid: profile.userid, role: profile.role } : skipToken
    );
    const properties = propertiesJson?.properties || [];
    console.log(contacts);

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                <h2 className="mb-4">Trang Quản Trị</h2>

                {/* Cards thống kê */}
                <div className="row mb-4">
                    <Link to="/admin/properties" className="col-md-4 col-lg-3 mb-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5 className="card-title">Tổng BĐS</h5>
                                <p className="card-text display-6">
                                    {loadingProperties ? '...' : properties.length}
                                </p>
                            </div>
                        </div>
                    </Link>
                    <div className="col-md-4 col-lg-3 mb-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <h5 className="card-title">Tổng Người Dùng</h5>
                                <p className="card-text display-6">
                                    {loadingUsers ? '...' : users.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-3 mb-3">
                        <div className="card text-white bg-warning">
                            <div className="card-body">
                                <h5 className="card-title">Tổng Báo Cáo</h5>
                                <p className="card-text display-6">
                                    {loadingContacts ? '...' : contacts.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table danh sách gần đây */}
                <div className="card">
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
            </div>
            <Footer />
        </>
    );
};

export default AdminProperties;
