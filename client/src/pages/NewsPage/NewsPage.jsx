import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from "../../components/Footer/Footer";
import News from "../../components/News/News";

const NewsPage = () => {
    return (
        <>
            <Navbar />
            <News />
            <Footer />
        </>
    );
}
export default NewsPage;