import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationPage.module.css";
import NotificationItem from "../../components/notification/NotificationItem";
import { useNavigate } from "react-router-dom";
import { getWeeklyReminderPage } from "../../apis/ReminderAPIS/weeklyReminder";
import { WeeklyReminderResponse } from "../../types/Reminder";
import { useCharacter } from "../../contexts/CharacterContext";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const [notifications, setNotifications] = useState<WeeklyReminderResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        setNotifications([]);
        setNextCursor(null);
        setHasMore(true);

        const res = await getWeeklyReminderPage({ limit: 20 });
        setNotifications(res.items);
        setNextCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
      } catch (error) {
        console.error("알림 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    void fetchFirstPage();
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    if (loadingMore) return;
    if (!nextCursor) return;

    setLoadingMore(true);
    try {
      const res = await getWeeklyReminderPage({ limit: 20, cursor: nextCursor });
      setNotifications((prev) => [...prev, ...(res.items || [])]);
      setNextCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch (error) {
      console.error("알림 추가 로드 실패:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor]);

  // 스크롤 끝에 도달하면 다음 페이지 로드 (cursor 기반)
  useEffect(() => {
    const root = scrollRootRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void loadMore();
        }
      },
      {
        root,
        rootMargin: "160px",
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // 오늘과 지난 알림을 분류하는 함수 (최근 일주일치로 제한)
  const categorizeNotifications = () => {
    // 한국 시간으로 현재 시간 계산
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9

    // 24시간 전 시간 계산
    const oneDayAgo = new Date(koreaTime.getTime() - 24 * 60 * 60 * 1000);

    // 일주일 전 시간 계산
    const oneWeekAgo = new Date(koreaTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayNotifications: WeeklyReminderResponse[] = [];
    const pastNotifications: WeeklyReminderResponse[] = [];

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at);

      if (notificationDate >= oneDayAgo) {
        // 24시간 이내에 생성된 알림은 "오늘"
        todayNotifications.push(notification);
      } else if (notificationDate >= oneWeekAgo) {
        // 일주일 이내에 생성된 알림은 "지난 알림"
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
        <div className={styles.notification_container} ref={scrollRootRef}>
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
          {notifications.length === 0 && (
            <div className={styles.no_notification_container}>
              <img
                src={`/images/no-noti/no-${character || "momo"}.svg`}
                alt="알림이 없습니다."
              />
              <p className={styles.no_notification_text}>알림이 없습니다.</p>
            </div>
          )}

          {loadingMore && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              불러오는 중...
            </div>
          )}

          {/* 바닥 감지용 센티널 */}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
