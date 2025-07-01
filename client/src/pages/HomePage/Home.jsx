import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import PropertyList from '../PropertyList';
import banner from '../../assets/images/banner.png';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import LocationGrid from '../../components/LocationGrid/LocationGrid';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="banner-section">
                {/* <SearchBar /> */}
                <img src={banner} alt="banner" className="w-100" />
            </div>
            <NewsFeed />
            <PropertyList />
            <LocationGrid />
            <Footer />
        </>
    );
};

export default Home;
