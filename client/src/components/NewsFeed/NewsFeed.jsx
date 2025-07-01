import React from "react";
import styles from "./NewsFeed.module.css";
import MainContent from "./MainContent/MainContent";

const NewsFeed = () => {
    return (
        <div className={styles.section}>
         
           <MainContent/>
        </div>
    );
};
export default NewsFeed;