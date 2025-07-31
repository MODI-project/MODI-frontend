import React from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationPage.module.css";
import NotificationItem from "../../components/notification/NotificationItem";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notification_page_wrapper}>
      <Header
        left="/icons/arrow_left.svg"
        middle="알림"
        LeftClick={() => {
          navigate(-1);
        }}
      />
      <div className={styles.notification_container}>
        <div className={styles.today_notification}>
          <span className={styles.today}>오늘</span>
          <NotificationItem />
          <NotificationItem />
        </div>
        <div className={styles.left_notification}>
          <span className={styles.left}>지난 알림</span>
          <NotificationItem />
          <NotificationItem />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
