import React from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => (
    <div>
        <Navbar />
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bảng điều khiển Admin</h1>
            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded">
                    <h2>Số lượng bất động sản: 50</h2>
                    <h2>Số lượng người dùng: 100</h2>
                    <h2>Yêu cầu liên hệ: 20</h2>
                </div>
                <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Quản lý Bất động sản</button>
                <button className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Quản lý Người dùng</button>
                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Quản lý Liên hệ</button>
            </div>
        </div>
    </div>
);

export default AdminDashboard;