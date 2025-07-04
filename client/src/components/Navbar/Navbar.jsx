import React, { useState, useEffect } from 'react';
import navItem from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useGetProfileQuery } from '../../api/apiSlice';

const Tabs = [
    { name: 'Trang Chủ', link: '/' },
    { name: 'Tin Tức', link: '/news' },
    { name: 'Liên Hệ', link: '/contact' },
];

const Navbar = () => {
    // const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             try {
    //                 // Giả sử bạn có API để lấy thông tin người dùng
    //                 const res = await axios.get('http://localhost:3000/auth/me', {
    //                     headers: { Authorization: `Bearer ${token}` },
    //                 });
    //                 setUser(res.data.user); // Giả sử API trả về đối tượng user với trường name
    //             } catch (error) {
    //                 console.error('Lỗi lấy thông tin người dùng:', error);
    //                 localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
    //                 setUser(null);
    //             }
    //         }
    //     };
    //     fetchUser();
    // }, []);

    const { data: user, isError } = useGetProfileQuery(undefined, {
        skip: !localStorage.getItem('token'),
    });

    // Xử lý lỗi token không hợp lệ
    if (isError && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.reload();
      }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light w-100 fixed-top mb-4">
            <div className="w-100 d-flex flex-wrap align-items-center justify-content-between px-4">
                <a className="navbar-brand" href="/">Real Estate</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {Tabs.map((tab) => (
                            <li key={tab.link} className={navItem.navItem}>
                                <NavLink
                                    to={tab.link}
                                    className={({ isActive }) =>
                                        `${navItem.navLink} ${isActive ? navItem.activeLink : ''}`
                                    }
                                >
                                    {tab.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {user ? (
                            <li className={`${navItem.navItem} ${navItem.userWrapper}`}>
                                <span className={`${navItem.navLink} nav-link`}>
                                    Xin chào, {user.name}
                                </span>
                                <ul className={navItem.dropdownMenu}>
                                    <li className={navItem.dropdownItem}>
                                        <button
                                            className={`${navItem.dropdownLink} btn btn-link text-start w-100`}
                                            onClick={handleLogout}
                                        >
                                            Đăng Xuất
                                        </button>
                                    </li>
                                    <li className={navItem.dropdownItem}>
                                        <a href="/profile" className={navItem.dropdownLink}>Hồ Sơ Cá Nhân</a>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className={navItem.navItem}>
                                <a className={`${navItem.navLink} nav-link`} href="/login">
                                    Đăng Nhập | Đăng Ký
                                </a>
                            </li>
                        )}

                        <li className={navItem.navItem}>
                            <a className="btn btn-outline-secondary text-black" type="button" href="#">
                                Đăng Tin
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;