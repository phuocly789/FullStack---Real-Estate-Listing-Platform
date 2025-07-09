    import React from 'react';
    import Navbar from '../../components/Navbar/Navbar';
    import Footer from '../../components/Footer/Footer';
    import AdminDashBoard from '../../components/Admin/AdminDashBoard/AdminDashBoard';


    const AdminPage = () => {
        return (
            <>
                <Navbar />
                <AdminDashBoard />
                <Footer />
            </>
        );
    };

    export default AdminPage;
