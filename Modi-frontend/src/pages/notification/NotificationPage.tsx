import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationPage.module.css";
import NotificationItem from "../../components/notification/NotificationItem";
import { useNavigate } from "react-router-dom";
import { getWeeklyReminder } from "../../apis/ReminderAPIS/weeklyReminder";
import { WeeklyReminderResponse } from "../../types/Reminder";
import { useCharacter } from "../../contexts/CharacterContext";
import { useGeolocation } from "../../contexts/GeolocationContext";
import { getRemindersByAddress } from "../../apis/ReminderAPIS/remindersByAddress";
import { fetchMonthlyDiaries } from "../../apis/Diary/diaries.read";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const { address } = useGeolocation();
  const [notifications, setNotifications] = useState<WeeklyReminderResponse[]>(
    []
  );
  const [locationNotifications, setLocationNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("=== 알림 페이지 로드 시작 ===");
        console.log("현재 Geolocation 주소:", address);

        // 주간 알림 데이터 가져오기
        console.log("주간 알림 API 호출 시작");
        const weeklyData = await getWeeklyReminder();
        console.log("주간 알림 응답:", weeklyData);
        console.log("주간 알림 개수:", weeklyData.length);
        setNotifications(weeklyData);

        // 현재 위치 기반 알림 데이터 가져오기
        if (address) {
          console.log("현재 위치 기반 알림 조회:", address);
          const locationData = await getRemindersByAddress(address);
          console.log("위치 기반 알림 데이터:", locationData);
          console.log("위치 기반 알림 개수:", locationData.length);

          // 가장 최근 기록만 추출
          if (locationData.length > 0) {
            const sortedData = locationData.sort((a, b) => {
              const dateA = new Date(a.datetime || a.created_at || 0);
              const dateB = new Date(b.datetime || b.created_at || 0);
              return dateB.getTime() - dateA.getTime();
            });
            const latestRecord = sortedData[0];
            console.log("가장 최근 기록:", latestRecord);
            setLocationNotifications([latestRecord]);
          } else {
            setLocationNotifications([]);
          }
        } else {
          console.log("Geolocation 주소가 없습니다.");
          setLocationNotifications([]);
        }
      } catch (error) {
        console.error("알림 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
        console.log("=== 알림 페이지 로드 완료 ===");
      }
    };

    fetchNotifications();
  }, [address]);

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
          {/* 위치 기반 알림 */}
          {locationNotifications.length > 0 && (
            <div className={styles.today_notification}>
              <span className={styles.today}>현재 위치</span>
              {locationNotifications.map((notification, index) => (
                <NotificationItem
                  key={`location-${index}`}
                  id={notification.id || index}
                  emotion={notification.emotion || "기쁨"}
                  lastVisit={
                    notification.datetime ||
                    notification.created_at ||
                    new Date().toISOString()
                  }
                  address={notification.address || address || ""}
                  created_at={notification.created_at || notification.datetime}
                  isRead={false}
                  onClick={() => {
                    navigate("/notification-grid", {
                      state: {
                        address: notification.address || address,
                        totalCount: locationNotifications.length,
                      },
                    });
                  }}
                />
              ))}
            </div>
          )}

          {/* 주간 알림 */}
          {todayNotifications.length > 0 && (
            <div className={styles.today_notification}>
              <span className={styles.today}>오늘</span>
              {todayNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  emotion={notification.emotion}
                  lastVisit={notification.lastVisit}
                  address={notification.address}
                  created_at={notification.created_at}
                  isRead={false}
                  onClick={() => {
                    navigate("/notification-grid", {
                      state: {
                        address: notification.address,
                      },
                    });
                  }}
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
                  id={notification.id}
                  emotion={notification.emotion}
                  lastVisit={notification.lastVisit}
                  address={notification.address}
                  created_at={notification.created_at}
                  isRead={true}
                  onClick={() => {
                    navigate("/notification-grid", {
                      state: {
                        address: notification.address,
                      },
                    });
                  }}
                />
              ))}
            </div>
          )}
          {notifications.length === 0 && locationNotifications.length === 0 && (
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
