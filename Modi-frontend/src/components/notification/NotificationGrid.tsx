import React from "react";
import styles from "./NotificationGrid.module.css";

const NotificationGrid = () => {
  return (
    <div className={styles.notification_grid_item_container}>
      <span className={styles.notification_grid_item_date}>25.05.23</span>
      <div className={styles.notification_grid_item_container}></div>
    </div>
  );
};

export default NotificationGrid;
