import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationPage.module.css";
import NotificationItem from "../../components/notification/NotificationItem";
import { useNavigate } from "react-router-dom";
import { getWeeklyReminder } from "../../apis/ReminderAPIS/weeklyReminder";
import { WeeklyReminderResponse } from "../../types/Reminder";
import { useCharacter } from "../../contexts/CharacterContext";
import { useDongGeofence } from "../../hooks/useDongGeofence";
import { reverseToDong } from "../../apis/MapAPIS/reverseGeocode";
import { notifyEnter } from "../../apis/ReminderAPIS/notifyEnter";
import { getRemindersByAddress } from "../../apis/ReminderAPIS/remindersByAddress";
import { fetchMonthlyDiaries } from "../../apis/Diary/diaries.read";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const [notifications, setNotifications] = useState<WeeklyReminderResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [enterInfo, setEnterInfo] = useState<{
    dong: string;
    days: number;
  } | null>(null);

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

  // 동 입장 시 과거 기록 조회 → 며칠 만인지 계산 → 알림 노출
  const onEnterDong = useCallback(
    async ({ dong, lat, lon }: { dong: string; lat: number; lon: number }) => {
      try {
        const today = new Date();
        let days = 0;

        // 1) 서버에서 해당 동의 일기 배열을 받아 가장 최근 기록 기준으로 계산
        const address = `${dong}`;
        const serverReminders = await getRemindersByAddress(address);
        if (Array.isArray(serverReminders) && serverReminders.length > 0) {
          const toDate = (s?: string) => (s ? new Date(s) : null);
          const latest = [...serverReminders]
            .map((r) => toDate(r.datetime) || toDate(r.created_at))
            .filter((d): d is Date => d instanceof Date)
            .sort((a, b) => b.getTime() - a.getTime())[0];
          if (latest) {
            days = Math.max(
              0,
              Math.ceil(
                (today.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24)
              )
            );
          }
        }

        // 2) 서버 응답이 없거나 날짜 파싱 실패 시, 이번 달 데이터로 보조 계산
        if (days === 0) {
          const year = today.getFullYear();
          const month = today.getMonth() + 1;
          const diaries = await fetchMonthlyDiaries(year, month);
          const sameDong = diaries
            .filter(
              (d) => typeof d.address === "string" && d.address.includes(dong)
            )
            .sort((a, b) => b.date.localeCompare(a.date));
          if (sameDong.length > 0) {
            const last = new Date(sameDong[0].date);
            days = Math.max(
              0,
              Math.ceil(
                (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
              )
            );
          }
        }

        setEnterInfo({ dong, days });
        await notifyEnter({ dong, lat, lon, daysSince: days });
      } catch (e) {
        console.warn("[NotificationPage] onEnterDong failed:", e);
      }
    },
    []
  );

  useDongGeofence(onEnterDong);

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
