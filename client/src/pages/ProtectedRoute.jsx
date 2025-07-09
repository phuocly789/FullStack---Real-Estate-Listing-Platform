import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Chưa đăng nhập thì vẫn cho vào nếu "guest" được phép
        return allowedRoles.includes('GUEST') ? element : <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (allowedRoles.includes(role)) {
            return element;
        } else {
            // Nếu là ADMIN nhưng không được phép vào, chuyển hướng
            return role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/unauthorized" />;
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
