import React from "react";
import styles from "./NotificationItem.module.css";
const NotificationItem = () => {
  return (
    <div className={styles.notification_item}>
      <div className={styles.noti_alert}></div>
      <div className={styles.noti_emotion}>
        <img src="/emotion_tag/momo/momo-happy.svg" alt="happy" />
      </div>
      <div className={styles.noti_content_container}>
        <span className={styles.noti_title}>00일만에 XX에 왔어요!</span>
        <span className={styles.noti_content}>이전 기록을 확인해보세요</span>
        <span className={styles.noti_time}>00시간 전</span>
      </div>
      <button className={styles.noti_detail_btn}>
        <img src="/icons/arrow_right.svg" alt="arrow_right" />
      </button>
    </div>
  );
};

export default NotificationItem;
