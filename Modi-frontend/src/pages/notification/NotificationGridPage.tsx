import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationGridPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getRemindersByAddressPage,
  type ReminderDiaryItem,
} from "../../apis/ReminderAPIS/remindersByAddress";
import NotificationGrid from "../../components/notification/NotificationGrid";

const NotificationGridPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [diaries, setDiaries] = useState<ReminderDiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        // location.state에서 address와 totalCount 가져오기
        const state = location.state as {
          address?: string;
          totalCount?: number;
        };
        const targetAddress = state?.address || "";
        setAddress(targetAddress);

        // 초기화
        setDiaries([]);
        setNextCursor(null);
        setHasMore(true);

        if (!targetAddress) return;

        const res = await getRemindersByAddressPage({
          address: targetAddress,
          limit: 20,
        });
        setDiaries(res.items);
        setNextCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
      } catch (error) {
        console.error("NotificationGridPage 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    void fetchFirstPage();
  }, [location.state]);

  const loadMore = useCallback(async () => {
    if (!address) return;
    if (!hasMore) return;
    if (loadingMore) return;
    if (!nextCursor) return;

    setLoadingMore(true);
    try {
      const res = await getRemindersByAddressPage({
        address,
        limit: 20,
        cursor: nextCursor,
      });
      setDiaries((prev) => [...prev, ...(res.items || [])]);
      setNextCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch (error) {
      console.error("NotificationGridPage 추가 로드 실패:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [address, hasMore, loadingMore, nextCursor]);

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
        rootMargin: "120px",
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // 주소에서 마지막 단어만 추출
  const getLastWordFromAddress = (address: string) => {
    if (!address || address.trim() === "") {
      return "여기";
    }
    const words = address.split(" ");
    return words[words.length - 1] || "여기";
  };

  const lastWord = getLastWordFromAddress(address);

  // 날짜별로 그룹화
  const grouped = useMemo(() => {
    const map = new Map<string, ReminderDiaryItem[]>();
    for (const diary of diaries) {
      const date = new Date(diary.datetime || diary.created_at || "");
      const dayKey = `${date.getFullYear().toString().slice(2)}. ${
        date.getMonth() + 1
      }. ${date.getDate()}`;
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.get(dayKey)!.push(diary);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const dateA = new Date(a[1][0].datetime || a[1][0].created_at || "");
      const dateB = new Date(b[1][0].datetime || b[1][0].created_at || "");
      return dateB.getTime() - dateA.getTime();
    });
  }, [diaries]);

  // 일기 클릭 핸들러
  const handleDiaryClick = (diaryId: number) => {
    navigate("/recorddetail", {
      state: {
        diaryId: diaryId,
      },
    });
  };

  return (
    <div className={styles.notification_grid_page_wrapper}>
      <div className={styles.notification_grid_page_container}>
        <Header
          left="/icons/arrow_left.svg"
          middle={lastWord}
          LeftClick={() => {
            navigate(-1);
          }}
        />
        <div
          className={styles.notification_grid_container}
          ref={scrollRootRef}
        >
          {loading && (
            <div className={styles.state}>
              <div className={styles.spinner} />
              <span>불러오는 중…</span>
            </div>
          )}

          {!loading && diaries.length === 0 && (
            <div className={styles.state}>
              <span>이 위치에는 아직 일기가 없어요.</span>
            </div>
          )}

          {!loading && diaries.length > 0 && (
            <>
              <div className={styles.sections}>
                {grouped.map(([day, dayDiaries]) => (
                  <NotificationGrid
                    key={day}
                    date={day}
                    diaries={dayDiaries}
                    onDiaryClick={handleDiaryClick}
                  />
                ))}
              </div>

              {loadingMore && (
                <div className={styles.state}>
                  <div className={styles.spinner} />
                  <span>더 불러오는 중…</span>
                </div>
              )}

              {/* 바닥 감지용 센티널 */}
              <div ref={sentinelRef} style={{ height: 1 }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationGridPage;
