import React, { useState, useMemo } from "react";
import { allDiaries, Diary } from "../../data/diaries";
import StatsDateSelect from "../../components/MyPage/Stats/StatsDateSelect";
import styles from "./MyPage.module.css";
import EmotionStatsCard from "../../components/MyPage/Stats/StatsCard/EmotionStatsCard";
import StyleStats from "../../components/MyPage/Stats/StatsCard/StyleStats";
import VisitStats from "../../components/MyPage/Stats/StatsCard/VisitStats";

type Emotion = Diary["emotion"];

export default function StatsView() {
  // 1) 사용 가능한 월 리스트 (중복 제거·정렬)
  const allMonths = useMemo(
    () => Array.from(new Set(allDiaries.map((d) => d.date.slice(0, 7)))).sort(),
    []
  );

  // 2) 선택된 월 상태
  const [month, setMonth] = useState<string>(allMonths.at(-1)!);

  // 3) 해당 월의 다이어리만 필터
  const monthDiaries = useMemo(
    () => allDiaries.filter((d) => d.date.startsWith(month)),
    [month]
  );

  // 4) 감정별 카운트 계산
  const emotionCounts = useMemo(() => {
    const counts = {} as Record<Emotion, number>;
    // 초기화
    monthDiaries.forEach((d) => {
      if (!(d.emotion in counts)) counts[d.emotion] = 0;
      counts[d.emotion] += 1;
    });
    return counts;
  }, [monthDiaries]);

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
        <div className={styles.chartSection}>
          <EmotionStatsCard />
          <StyleStats />
          <VisitStats />
        </div>
      </div>
    </div>
  );
}
