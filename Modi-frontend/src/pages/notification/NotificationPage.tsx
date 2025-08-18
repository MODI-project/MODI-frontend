import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationPage.module.css";
import NotificationItem from "../../components/notification/NotificationItem";
import { useNavigate } from "react-router-dom";
import { getWeeklyReminder } from "../../apis/ReminderAPIS/weeklyReminder";
import { WeeklyReminderResponse } from "../../types/Reminder";
import { useCharacter } from "../../contexts/CharacterContext";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const [notifications, setNotifications] = useState<WeeklyReminderResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getWeeklyReminder();
        setNotifications(data);
      } catch (error) {
        console.error("알림 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // 오늘과 지난 알림을 분류하는 함수
  const categorizeNotifications = () => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayNotifications: WeeklyReminderResponse[] = [];
    const pastNotifications: WeeklyReminderResponse[] = [];

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at);
      if (notificationDate >= todayStart) {
        todayNotifications.push(notification);
      } else {
        pastNotifications.push(notification);
      }
    });

    return { todayNotifications, pastNotifications };
  };

  const { todayNotifications, pastNotifications } = categorizeNotifications();

  if (loading) {
    return (
      <div className={styles.notification_page_wrapper}>
        <div className={styles.notification_page_container}>
          <Header
            left="/icons/arrow_left.svg"
            middle="알림"
            LeftClick={() => {
              navigate(-1);
            }}
          />
          <div className={styles.notification_container}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notification_page_wrapper}>
      <div className={styles.notification_page_container}>
        <Header
          left="/icons/arrow_left.svg"
          middle="알림"
          LeftClick={() => {
            navigate(-1);
          }}
        />
        <div className={styles.notification_container}>
          {todayNotifications.length > 0 && (
            <div className={styles.today_notification}>
              <span className={styles.today}>오늘</span>
              {todayNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  emotion={notification.emotion}
                  lastVisit={notification.lastVisit}
                  address={notification.address}
                  created_at={notification.created_at}
                  isRead={false}
                />
              ))}
            </div>
          )}
          {pastNotifications.length > 0 && (
            <div className={styles.left_notification}>
              <span className={styles.left}>지난 알림</span>
              {pastNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  emotion={notification.emotion}
                  lastVisit={notification.lastVisit}
                  address={notification.address}
                  created_at={notification.created_at}
                  isRead={true}
                />
              ))}
            </div>
          )}
          {notifications.length === 0 && (
            <div className={styles.no_notification_container}>
              <img
                src={`/images/no-noti/no-${character || "momo"}.svg`}
                alt="알림이 없습니다."
              />
              <p className={styles.no_notification_text}>알림이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
