import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/common/Header";
import styles from "./NotificationGridPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getRemindersByAddress } from "../../apis/ReminderAPIS/remindersByAddress";
import { ReminderDiaryItem } from "../../apis/ReminderAPIS/remindersByAddress";
import NotificationGrid from "../../components/notification/NotificationGrid";

const NotificationGridPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [diaries, setDiaries] = useState<ReminderDiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // location.state에서 address와 totalCount 가져오기
        const state = location.state as {
          address?: string;
          totalCount?: number;
        };
        const targetAddress = state?.address || "";
        setAddress(targetAddress);

        if (targetAddress) {
          const data = await getRemindersByAddress(targetAddress);

          setDiaries(data);
        }
      } catch (error) {
        console.error("NotificationGridPage 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

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
        <div className={styles.notification_grid_container}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationGridPage;
