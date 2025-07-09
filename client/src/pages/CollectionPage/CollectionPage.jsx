import React from "react";
import Navbar from '../../components/Navbar/Navbar';
import Footer from "../../components/Footer/Footer";
import Collection from "../../components/Collection/Collection";

const CollectionPage = () => {
    return (
        <>
            <Navbar />
            <Collection />
            <Footer />
        </>
    );
}
export default CollectionPage;