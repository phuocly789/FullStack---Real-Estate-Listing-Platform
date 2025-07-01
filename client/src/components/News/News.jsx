import React from "react";
import FeaturedArticle from "./FeaturedArticle/FeaturedArticle";
import ArticleList from "./ArticleList/ArticleList";
import PopularPosts from "./PopularPosts/PopularPosts";
import styles from "./News.module.css";
const News = () => {
    return (
        <div className={styles.container}>
            <div className="row">
                <h1 className={styles.title}>Tin tức bất động sản mới nhất</h1>
                <p className={styles.subtitle}>
                    Thông tin mới, đầy đủ, hấp dẫn về thị trường bất động sản Việt Nam thông qua dữ liệu lớn về giá, giao dịch, nguồn cung - cầu và khảo sát thực tế của đội ngũ phóng viên, biên tập của Batdongsan.com.vn.
                </p>
                <hr className={styles.hr}/>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <FeaturedArticle />
                    <ArticleList />
                </div>
                <div className="col-md-4">
                    <PopularPosts />
                </div>
            </div>
        </div>
    );

};
export default News;