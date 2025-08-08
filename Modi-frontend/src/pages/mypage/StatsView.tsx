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

export default function StatsView() {
  // 1) 사용 가능한 월 리스트 (중복 제거·정렬)
  const allMonths = useMemo(
    () =>
      Array.from(new Set(mockDiaries.map((d) => d.date.slice(0, 7)))).sort(),
    []
  );

  // 2) 선택된 월 상태
  const [month, setMonth] = useState<string>(allMonths.at(-1)!);

  const emotionStats = useMemo(() => getEmotionStatsByMonth(month), [month]);
  const toneStats = useMemo(() => getToneStatsByMonth(month), [month]);
  const visitStats = useMemo(() => getVisitStatsByMonth(month), [month]);

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
          <EmotionStatsCard data={emotionStats} month={month} />
          <StyleStats data={toneStats} />
          <VisitStats data={visitStats} />
        </div>
      </div>
    </div>
  );
}
