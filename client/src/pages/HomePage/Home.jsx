import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PropertyList from '../PropertyList';
import banner from '../../assets/images/banner.png';
import LocationGrid from '../../components/LocationGrid/LocationGrid';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import MainContent from '../../components/MainContent/MainContent';
import { useGetPropertiesQuery } from '../../api/apiSlice';

const Home = () => {
    const { data, isLoading, isError } = useGetPropertiesQuery({}, { refetchOnMountOrArgChange: true });
    return (
        <>
            <Navbar />
            <div className="banner-section">
                {/* <SearchBar /> */}
                <img src={banner} alt="banner" className="w-100" />
            </div>
            <MainContent properties={data?.properties} isLoading={isLoading} isError={isError} />
            <PropertyList properties={data?.properties} isLoading={isLoading} isError={isError} />
            <Footer />
        </>
    );
};

export default Home;
