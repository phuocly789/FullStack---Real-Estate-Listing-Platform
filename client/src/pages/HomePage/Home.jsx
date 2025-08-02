import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PropertyList from '../PropertyList';
import banner from '../../assets/images/banner.png';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import MainContent from '../../components/MainContent/MainContent';
import { useGetPropertiesQuery } from '../../api/apiSlice';

const Home = () => {
    const { data, isLoading, isError } = useGetPropertiesQuery({}, { refetchOnMountOrArgChange: true });

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (isError || !data?.properties) {
        return (
            <div className={styles.errorContainer}>
                <p>Lỗi: Không thể tải dữ liệu bất động sản.</p>
                <button className={`btn btn-primary ${styles.retryBtn}`} onClick={() => window.location.reload()}>
                    Thử lại
                </button>
            </div>
        );
    }


    console.table(data?.properties);
    return (
        <>
            <Navbar />
            <div className="banner-section">
                <img src={banner} alt="banner" className="w-100" />
            </div>
            
            <MainContent properties={data.properties}   />
            <PropertyList properties={data.properties} />
            <Footer />
        </>
    );
};

export default Home;