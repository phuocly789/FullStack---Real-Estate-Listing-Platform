import { Link } from 'react-router-dom';
import styles from './PropertyCard.module.css';
import { FaRegHeart, FaHeart, FaCamera } from 'react-icons/fa';

const PropertyCard = ({ id, title, price, area, location, image, imageCount, isFavorite, onToggleFavorite, createdat }) => {
    return (
        <div className={styles.card}>
            <Link to={`/product/${id}`} className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                    <img
                        src={image || 'https://via.placeholder.com/300'}
                        alt={title}
                        className={styles.image}
                    />
                    <div className={styles.imageCount}>
                        <FaCamera className={styles.icon} />
                        <span>{imageCount || 0}</span>
                    </div>
                </div>
            </Link>
            <div className={styles.content}>
                <h5 className={styles.title}>{title || 'Không có tiêu đề'}</h5>
                <div className={styles.price}>
                    {price ? `${price.toLocaleString()} VND` : 'Giá không xác định'}
                </div>
                <div className={styles.detail}>
                    {area ? `${area} m²` : 'Diện tích không xác định'} - {location || 'Vị trí không xác định'}
                </div>
                <div className={styles.footer}>
                    <span>
                        {createdat
                            ? new Date(createdat).toLocaleDateString('vi-VN')
                            : 'Không có thời gian'}
                    </span>
                    <button
                        className={`${styles.heartIcon} ${isFavorite ? styles.favoriteActive : ''}`}
                        onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn chuyển hướng khi click vào nút yêu thích
                            onToggleFavorite();
                        }}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PropertyCard;