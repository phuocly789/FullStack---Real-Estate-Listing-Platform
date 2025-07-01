import React from 'react';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import styles from './PropertyList.module.css';
import ThanhHoa from '../assets/images/Thanh-hoa.png';
import ThuDauMot from '../assets/images/tdm.png';
import properties from '../data/properties';


const PropertyList = () => (
    <section className={styles.section}>
        <div className='d-flex  mb-4'>
        <h2 className={styles.heading}>Bất động sản dành cho bạn</h2>
        <button className={`btn btn-outline-primary ms-auto text-black`}>Xem Thêm</button>
        </div>
        <div className={styles.grid}>
            {properties.map((prop) => (
                <PropertyCard key={prop.id} {...prop} />
            ))}
        </div>
        <div className={styles.buttonWrapper}>
            <button className={styles.expandButton}>Mở rộng</button>
        </div>
    </section>
);

export default PropertyList;
