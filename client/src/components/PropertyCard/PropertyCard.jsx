import { Link } from 'react-router-dom';
import styles from './PropertyCard.module.css';
import { FaRegHeart, FaCamera } from 'react-icons/fa';

const PropertyCard = ({ id, title, price, area, location, image, imageCount }) => {
    return (
        <Link to={`/product/${id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={title} className={styles.image} />
                <div className={styles.imageCount}>
                    <FaCamera className={styles.icon} />
                    <span>{imageCount}</span>
                </div>
            </div>
            <div className={styles.content}>
                <h5 className={styles.title}>{title}</h5>
                <div className={styles.price}>{price.toLocaleString()} VND</div>
                <div className={styles.detail}>{area} m² - {location}</div>
                <div className={styles.footer}>
                    <span>{new Date().toLocaleDateString()}</span>
                    <FaRegHeart className={styles.heartIcon} />
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
