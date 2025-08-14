import React from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationGridPage.module.css";
import { useNavigate } from "react-router-dom";
import NotificationGrid from "../../components/notification/NotificationGrid";

const NotificationGridPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notification_grid_page_wrapper}>
      <div className={styles.notification_grid_page_container}>
        <Header
          left="/icons/arrow_left.svg"
          middle="장소 이름 props로"
          LeftClick={() => {
            navigate(-1);
          }}
        />
        <div className={styles.notification_grid_container}>
          <NotificationGrid />
        </div>
      </div>
    </div>
  );
};

export default NotificationGridPage;
