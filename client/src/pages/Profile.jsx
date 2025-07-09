import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [user, setUser] = useState({ name: "Nguyen Van A", email: "a@example.com", phone: "0901234567", avatar: "" });

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Hồ sơ của tôi</h1>
                <div className="space-y-2">
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Tên"
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="p-2 border rounded w-full"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="p-2 border rounded w-full"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Cập nhật</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;