import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ProductDetailPage = () => {
    const { id } = useParams();

    return (
        <>
            <Navbar />
            <ProductDetail id={parseInt(id)} />
            <Footer />
        </>

    );
};

export default ProductDetailPage;
