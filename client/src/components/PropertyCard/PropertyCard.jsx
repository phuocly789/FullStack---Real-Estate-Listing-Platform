import { Link } from 'react-router-dom';
import styles from './PropertyCard.module.css';
import { FaRegHeart, FaHeart, FaCamera } from 'react-icons/fa';

// Hàm rút gọn văn bản
const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
const PropertyCard = ({ id, title, price, area, location, image, imageCount, isFavorite, onToggleFavorite, createdat }) => {
    return (
        <Link to={`/product/${id}`} className={styles.imageLink}>
            <div className={styles.card}>
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
                <div className={styles.content}>
                    <h5 className={styles.title}>{truncateText(title, 26) || 'Không có tiêu đề'}</h5>
                    <div className={styles.price}>
                        {price ? `${truncateText(price.toLocaleString(), 20)} VND` : 'Giá không xác định'}
                    </div>
                    <div className={styles.detail}>
                        <b>Diện tích:</b> {area ? `${truncateText(area, 20)} m²` : 'Diện tích không xác định'}
                    </div>
                    <div className={styles.location}>
                        {truncateText(location, 100) || 'Vị trí không xác định'}
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
        </Link>
    );
};

export default PropertyCard;