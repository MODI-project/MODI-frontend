import React, { useState, useMemo, useEffect } from "react";
import { mockDiaries, DiaryData } from "../../apis/diaryInfo";
import StatsDateSelect from "../../components/MyPage/Stats/StatsDateSelect";
import styles from "./MyPage.module.css";
import EmotionStatsCard from "../../components/MyPage/Stats/StatsCard/EmotionStatsCard";
import StyleStats from "../../components/MyPage/Stats/StatsCard/StyleStats";
import VisitStats from "../../components/MyPage/Stats/StatsCard/VisitStats";

import { getEmotionStatsByMonth } from "../../utils/getEmotionStatsByMonth";
import { getToneStatsByMonth } from "../../utils/getToneStatsByMonths";
import { getVisitStatsByMonth } from "../../utils/getVisitStatsByMonth";

type Emotion = DiaryData["emotion"];

function lastNMonths(n: number) {
  const res: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    res.push(`${y}-${m}`);
    d.setMonth(d.getMonth() - 1);
  }
  return res.reverse(); // 오래된 → 최신
}

export default function StatsView() {
  // 1) 월 목록: mockDiaries 의존 제거
  const allMonths = useMemo(() => lastNMonths(12), []);
  const [month, setMonth] = useState<string>(allMonths.at(-1)!);

  // 2) 통계 상태
  const [emotionStats, setEmotionStats] = useState<
    { label: string; value: number }[]
  >([]);
  const [toneStats, setToneStats] = useState<
    { label: string; value: number }[]
  >([]);
  const [visitStats, setVisitStats] = useState<
    { label: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3) 월 변경 시 3개 유틸(비동기) 호출
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      getEmotionStatsByMonth(month),
      getToneStatsByMonth(month),
      getVisitStatsByMonth(month),
    ])
      .then(([emo, tone, visit]) => {
        if (!alive) return;
        setEmotionStats(emo);
        setToneStats(tone);
        setVisitStats(visit);
      })
      .catch((e: any) => {
        if (!alive) return;
        const status = e?.response?.status;
        setError(
          status === 403
            ? "인증 권한이 없습니다 (403)"
            : "통계를 불러오지 못했습니다."
        );
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [month]);

  return (
    <div className={styles.statsContainer}>
      <div className={styles.fixedTop}>
        <StatsDateSelect
          months={allMonths}
          initialMonth={month}
          onMonthChange={setMonth}
        />
      </div>

      {/* 통계 차트 영역 */}
      <div className={styles.scrollWrapper}>
        {loading && <div className={styles.loading}>불러오는 중…</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <div className={styles.chartSection}>
            <EmotionStatsCard data={emotionStats} month={month} />
            <StyleStats data={toneStats} />
            <VisitStats data={visitStats} />
          </div>
        )}
      </div>
    </div>
  );
}
