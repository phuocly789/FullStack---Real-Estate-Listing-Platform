import { Link } from 'react-router-dom';
import styles from './PropertyCard.module.css';
import { FaRegHeart, FaCamera } from 'react-icons/fa';

const PropertyCard = ({ id, title, price, area, location, image, imageCount }) => {
    return (
        <Link to={`/product/${id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={image || 'https://via.placeholder.com/300'} // Ảnh mặc định
                    alt={title}
                    className={styles.image}
                />
                <div className={styles.imageCount}>
                    <FaCamera className={styles.icon} />
                    <span>{imageCount || 0}</span>
                </div>
            </div>
            <div className={styles.content}>
                <h5 className={styles.title}>{title || 'Không có tiêu đề'}</h5>
                <div className={styles.price}>
                    {price ? `${price.toLocaleString()} VND` : 'Giá không xác định'}
                </div>
                <div className={styles.detail}>
                    {area ? `${area} m²` : 'Diện tích không xác định'} - {location || 'Vị trí không xác định'}
                </div>
                <div className={styles.footer}>
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                    <FaRegHeart className={styles.heartIcon} />
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;