import { useState, useMemo, useEffect, useRef } from "react";
import pageStyles from "./HomePage.module.css";
import HomeHeader from "../../components/HomePage/HomeHeader/HomeHeader";
import DateSelector from "../../components/HomePage/DateSelect/DateSelector";
import ButtonBar from "../../components/common/button/ButtonBar/PrimaryButton";
import DatePickerBottomSheet from "../../components/common/DatePickerBottomSheet";
import PolaroidFrame from "../../components/HomePage/Diary/Polaroid/PolaroidFrame";
import EmotionCharacter from "../../components/HomePage/Diary/Polaroid/EmotionCharacter";
import EmotionTagList from "../../components/HomePage/Diary/Polaroid/EmotionTagList";
import { useCharacter } from "../../contexts/CharacterContext";
import {
  fetchDailyGroups,
  type DailyGroup,
} from "../../apis/Diary/diaries.read";
import { DiaryData } from "../../components/common/frame/Frame";
import { Emotion } from "../../data/diaries";

interface PolaroidViewProps {
  onSwitchView: () => void;
}

const [availableMonths, setAvailableMonths] = useState<string[]>([]);
const monthCache = useRef<Map<string, DailyGroup[]>>(new Map());

// ✅ YYYY-MM +/- N 달 계산
const addMonths = (ym: string, delta: number) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// ✅ 월(YYYY-MM) 단위로 일별 그룹 불러오기 + 캐시
async function loadMonth(ym: string) {
  if (monthCache.current.has(ym)) {
    return monthCache.current.get(ym)!;
  }
  const [y, m] = ym.split("-").map(Number);
  const data = await fetchDailyGroups(y, m);
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  monthCache.current.set(ym, sorted);
  return sorted;
}

export default function PolaroidView({ onSwitchView }: PolaroidViewProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { character } = useCharacter();
  const [groups, setGroups] = useState<DailyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // 현재 조회 중인 월(YYYY-MM)
  const [viewYM, setViewYM] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const allDates = useMemo(() => {
    // groups = [{ date:"YYYY-MM-DD", diaries:[...] }, ... ]
    return [...groups]
      .map((g) => g.date.slice(0, 10))
      .sort((a, b) => a.localeCompare(b));
  }, [groups]);

  const dateItems = useMemo(
    () => allDates.map((d) => ({ date: d })),
    [allDates]
  );

  const monthItems = useMemo(
    () => availableMonths.map((ym) => ({ date: ym })), // DateSelector는 {date:string}을 받음
    [availableMonths]
  );

  const diaryMap: Record<string, DiaryData> = useMemo(() => {
    const acc: Record<string, DiaryData> = {};
    for (const g of groups) {
      const dateKey = g.date.slice(0, 10);
      const sorted = [...(g.diaries ?? [])].sort((a, b) => {
        const ta = (a as any).created_at ?? "";
        const tb = (b as any).created_at ?? "";
        const byTime = tb.localeCompare(ta);
        if (byTime) return byTime;
        return (b.id ?? 0) - (a.id ?? 0);
      });
      const top = sorted[0];
      if (top) acc[dateKey] = top; // 단일 DiaryData 저장
    }
    return acc;
  }, [groups]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevOpen = useRef(false);

  const diariesByDate = useMemo(() => {
    const m: Record<string, DiaryData[]> = {};
    for (const g of groups) {
      const k = g.date.slice(0, 10);
      m[k] = [...(g.diaries ?? [])].sort((a, b) => {
        const ta = (a as any).created_at ?? "";
        const tb = (b as any).created_at ?? "";
        const byTime = tb.localeCompare(ta);
        return byTime || (b.id ?? 0) - (a.id ?? 0);
      });
    }
    return m;
  }, [groups]);

  const [subIndex, setSubIndex] = useState(0);
  const viewDate = allDates[currentIndex] || allDates[0] || "";
  const [tempDate, setTempDate] = useState<string>(viewDate);
  const currList = diariesByDate[viewDate] ?? [];
  const currentDiary: DiaryData | null = currList[subIndex] ?? null;

  useEffect(() => {
    if (isSheetOpen && !prevOpen.current) {
      setTempDate(viewDate);
    }
    prevOpen.current = isSheetOpen;
  }, [isSheetOpen, viewDate]);

  useEffect(() => {
    const idx = allDates.indexOf(tempDate);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
      setSubIndex(0);
    }
  }, [tempDate, allDates]);

  const indices = [currentIndex - 1, currentIndex, currentIndex + 1];
  // 선택된 월(viewYM)의 일별 목록 로드
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await loadMonth(viewYM); // ✅ 캐시 사용
        setGroups(list);
        setCurrentIndex(list.length ? list.length - 1 : 0); // 최신 날짜 포커스

        if (list.length > 0) {
          setAvailableMonths((prev) => {
            const s = new Set(prev);
            s.add(viewYM);
            return Array.from(s).sort(); // 정렬 규칙은 팀 룰대로
          });
        }
      } catch (error) {
        setGroups([]);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [viewYM]);

  const lastSub = Math.max(0, currList.length - 1);
  const atFirst = currentIndex === 0 && subIndex === 0;
  const atLast = currentIndex === allDates.length - 1 && subIndex === lastSub;

  const handlePrev = () => {
    if (atFirst) return; // 더 이상 못 가면 멈춤
    if (subIndex > 0) {
      setSubIndex((i) => i - 1);
      return;
    }
    if (currentIndex > 0) {
      const prevDate = allDates[currentIndex - 1];
      const prevList = diariesByDate[prevDate] ?? [];
      setCurrentIndex((i) => i - 1);
      setSubIndex(Math.max(0, prevList.length - 1));
    }
  };

  const handleNext = () => {
    if (atLast) return; // 더 이상 못 가면 멈춤
    if (subIndex < currList.length - 1) {
      setSubIndex((i) => i + 1);
      return;
    }
    if (currentIndex < allDates.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSubIndex(0);
    }
  };

  const handleChange = (newDate: string) => {
    setTempDate(newDate);
  };

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    const idx = allDates.indexOf(tempDate);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
      setSubIndex(0);
    }
  }, [tempDate, allDates]);

  if (loading) {
    return (
      <div className={pageStyles.wrapper}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isSheetOpen) return;
    (async () => {
      const tasks: Promise<void>[] = [];
      for (let d = -6; d <= 6; d++) {
        const ym = addMonths(viewYM, d);
        if (availableMonths.includes(ym)) continue;

        tasks.push(
          (async () => {
            try {
              const list = await loadMonth(ym);
              if (list.length > 0) {
                setAvailableMonths((prev) => {
                  const s = new Set(prev);
                  s.add(ym);
                  return Array.from(s).sort();
                });
              }
            } catch {
              /* 실패는 무시 */
            }
          })()
        );
      }
      await Promise.allSettled(tasks);
    })();
  }, [isSheetOpen, viewYM, availableMonths]);

  return (
    <div className={pageStyles.wrapper}>
      {/* HomeHeader 에 props 로 상태·핸들러 내려주기 */}
      <HomeHeader
        viewType="polaroid"
        currentDate={viewDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenModal={() => setIsSheetOpen(true)}
        onSwitchView={onSwitchView}
      />
      {/* ← 프레임만 캐러셀로 감싸기 */}
      <div className={pageStyles.content}>
        <div
          className={pageStyles.carousel}
          onTouchStart={(e) => {
            if (isSheetOpen) return;
            handleTouchStart(e);
          }}
          onTouchEnd={(e) => {
            if (isSheetOpen) return;
            handleTouchEnd(e);
          }}
        >
          <div className={pageStyles.carouselInner}>
            {indices.map((i, idx) => {
              let cls = pageStyles.hidden;
              if (idx === 0) cls = pageStyles.left;
              else if (idx === 1) cls = pageStyles.center;
              else if (idx === 2) cls = pageStyles.right;

              let diary: DiaryData | null = null;
              if (i === currentIndex) {
                // 현재 날짜: 여러 개 중 subIndex로 선택
                diary = diariesByDate[allDates[i]]?.[subIndex] ?? null;
              } else {
                // 이전/다음 날짜: 대표 일기(첫 번째)
                diary = diariesByDate[allDates[i]]?.[0] ?? null;
              }

              return (
                <div key={i} className={cls}>
                  {diary ? (
                    <PolaroidFrame
                      key={diary.id}
                      diaryData={diary}
                      diaryId={diary.id}
                    />
                  ) : (
                    <div className={pageStyles.emptySlot} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* ← 이 아래는 "항상 현재 일기" 것만 고정으로 보여줍니다 */}
        <div className={pageStyles.staticInfo}>
          <div className={pageStyles.polaroidCharacter}>
            <EmotionCharacter
              emotion={(currentDiary?.emotion as Emotion) || ""}
            />
          </div>

          <EmotionTagList tags={currentDiary?.tags ?? []} />
        </div>
      </div>

      {/* 날짜 선택 모달 */}
      <DatePickerBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        minimizeOnDrag={false} // 드래그 시 최소화 기능 원하면 true
      >
        <div className={pageStyles.modalInner}>
          <h3 className={pageStyles.modalTitle}>다른 날짜 일기 보기</h3>

          <DateSelector
            viewType="polaroid"
            items={monthItems}
            initialDate={viewYM}
            onChange={(ym) => setTempDate(ym)}
            userCharacter={character!}
          />
        </div>
        <div className={pageStyles.footerWrapper}>
          <ButtonBar
            location="modal"
            label="확인"
            onClick={async () => {
              setIsSheetOpen(false);
              setLoading(true);
              try {
                // 미리 로드해서 깜빡임 최소화 (캐시됨)
                const list = await loadMonth(tempDate); // tempDate = YYYY-MM
                setViewYM(tempDate); // ✅ 월 변경
                setGroups(list);
                setCurrentIndex(list.length ? list.length - 1 : 0);
                setSubIndex(0);
              } finally {
                setLoading(false);
              }
            }}
            size="primary"
            disabled={false}
          />
        </div>
      </DatePickerBottomSheet>
    </div>
  );
}
