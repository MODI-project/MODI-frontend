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

/** YYYY-MM +/- delta 달 계산 (컴포넌트 밖: 훅 미사용) */
const addMonths = (ym: string, delta: number) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function PolaroidView({ onSwitchView }: PolaroidViewProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { character } = useCharacter();

  // 월 인덱스와 월별 캐시
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const monthCache = useRef<Map<string, DailyGroup[]>>(new Map());

  // 선택 월(YYYY-MM)
  const [viewYM, setViewYM] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // 월 데이터
  const [groups, setGroups] = useState<DailyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // 캐러셀(일별)
  const allDates = useMemo(
    () =>
      [...groups]
        .map((g) => g.date.slice(0, 10))
        .sort((a, b) => a.localeCompare(b)),
    [groups]
  );
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const viewDate = allDates[currentIndex] || allDates[0] || "";
  const currList = diariesByDate[viewDate] ?? [];
  const currentDiary: DiaryData | null = currList[subIndex] ?? null;

  // 바텀시트 임시 선택: 월(YYYY-MM)
  const [tempYM, setTempYM] = useState<string>(viewYM);
  const prevOpen = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const [pickerItems, setPickerItems] = useState<{ date: string }[]>([]);
  const [tempDate, setTempDate] = useState<string>(viewDate);

  useEffect(() => {
    if (!isSheetOpen) return;

    (async () => {
      // ① 주변 월(±6개월) 후보
      const months: string[] = [];
      for (let d = -6; d <= 6; d++) months.push(addMonths(viewYM, d));

      // ② 프리페치 (캐시에 없으면 로드)
      await Promise.allSettled(
        months.map(async (ym) => {
          if (monthCache.current.has(ym)) return;
          try {
            const list = await loadMonth(ym);
            if (list.length > 0) {
              setAvailableMonths((prev) =>
                Array.from(new Set([...prev, ym])).sort()
              );
            }
          } catch {}
        })
      );
      const dates: string[] = [];
      const srcMonths = Array.from(
        new Set([viewYM, ...availableMonths, ...months])
      ).sort();
      srcMonths.forEach((ym) => {
        const groups = monthCache.current.get(ym) ?? [];
        groups.forEach((g) => dates.push(g.date.slice(0, 10)));
      });
      dates.sort((a, b) => a.localeCompare(b));
      setPickerItems(dates.map((d) => ({ date: d })));

      // 휠 첫 진입 시 현재 날짜로 초기화
      setTempDate(viewDate);
    })();
  }, [isSheetOpen, viewYM, availableMonths, viewDate]);

  /** 월 로더 (캐시 우선) */
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

  /** 선택 월 변경 시 데이터 로드 (한 번만) */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await loadMonth(viewYM);
        setGroups(list);
        setCurrentIndex(list.length ? list.length - 1 : 0); // 최신 날짜 포커스
        setSubIndex(0);

        if (list.length > 0) {
          setAvailableMonths((prev) => {
            const s = new Set(prev);
            s.add(viewYM);
            return Array.from(s).sort();
          });
        }
      } catch {
        setGroups([]);
        setCurrentIndex(0);
        setSubIndex(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [viewYM]);

  /** 바텀시트 열릴 때 주변 월 프리페치 */
  useEffect(() => {
    if (!isSheetOpen) return;
    (async () => {
      const tasks: Promise<void>[] = [];
      for (let d = -6; d <= 6; d++) {
        const ym = addMonths(viewYM, d);
        if (availableMonths.includes(ym) || monthCache.current.has(ym))
          continue;

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
              /* ignore */
            }
          })()
        );
      }
      await Promise.allSettled(tasks);
    })();
  }, [isSheetOpen, viewYM, availableMonths]);

  // 캐러셀 이동
  const lastSub = Math.max(0, currList.length - 1);
  const atFirst = currentIndex === 0 && subIndex === 0;
  const atLast = currentIndex === allDates.length - 1 && subIndex === lastSub;

  const handlePrev = () => {
    if (atFirst) return;
    if (subIndex > 0) return setSubIndex((i) => i - 1);
    if (currentIndex > 0) {
      const prevDate = allDates[currentIndex - 1];
      const prevList = diariesByDate[prevDate] ?? [];
      setCurrentIndex((i) => i - 1);
      setSubIndex(Math.max(0, prevList.length - 1));
    }
  };

  const handleNext = () => {
    if (atLast) return;
    if (subIndex < currList.length - 1) return setSubIndex((i) => i + 1);
    if (currentIndex < allDates.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSubIndex(0);
    }
  };

  // 월 목록(바텀시트 아이템)
  const monthItems = useMemo(
    () => availableMonths.map((ym) => ({ date: ym })), // DateSelector는 {date:string}
    [availableMonths]
  );

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

  const indices = [currentIndex - 1, currentIndex, currentIndex + 1];

  return (
    <div className={pageStyles.wrapper}>
      <HomeHeader
        viewType="polaroid"
        currentDate={viewDate} // 상단엔 현재 '일'
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenModal={() => setIsSheetOpen(true)}
        onSwitchView={onSwitchView}
      />

      <div className={pageStyles.content}>
        <div
          className={pageStyles.carousel}
          onTouchStart={(e) => {
            if (isSheetOpen) return;
            touchStartX.current = e.changedTouches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (isSheetOpen) return;
            const start = touchStartX.current;
            const end = e.changedTouches[0].clientX;
            if (start == null) return;
            const distance = start - end;
            if (distance > 50) handleNext();
            else if (distance < -50) handlePrev();
            touchStartX.current = null;
          }}
        >
          <div className={pageStyles.carouselInner}>
            {indices.map((i, idx) => {
              let cls = pageStyles.hidden;
              if (idx === 0) cls = pageStyles.left;
              else if (idx === 1) cls = pageStyles.center;
              else if (idx === 2) cls = pageStyles.right;

              const dateKey = allDates[i];
              const diary =
                i === currentIndex
                  ? diariesByDate[dateKey]?.[subIndex] ?? null
                  : diariesByDate[dateKey]?.[0] ?? null;

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

        <div className={pageStyles.staticInfo}>
          <div className={pageStyles.polaroidCharacter}>
            <EmotionCharacter
              emotion={(currentDiary?.emotion as Emotion) || ""}
            />
          </div>
          <EmotionTagList tags={currentDiary?.tags ?? []} />
        </div>
      </div>

      <DatePickerBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        minimizeOnDrag={false}
      >
        <div className={pageStyles.modalInner}>
          <h3 className={pageStyles.modalTitle}>다른 날짜 일기 보기</h3>
          <DateSelector
            viewType="polaroid"
            items={pickerItems}
            initialDate={viewDate}
            onChange={(d) => setTempDate(d)}
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
                // tempDate는 'YYYY-MM-DD' (휠에서 고른 날짜)
                const ym = (tempDate || viewDate).slice(0, 7);

                // 월 데이터 프리페치 + 적용
                const list = await loadMonth(ym);
                setViewYM(ym);
                setGroups(list);

                // 그 달의 날짜 목록에서 선택한 날짜 인덱스 찾기
                const all = list.map((g) => g.date.slice(0, 10));
                const idx = all.indexOf(tempDate);

                setCurrentIndex(
                  idx >= 0 ? idx : all.length ? all.length - 1 : 0
                );
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

// 파일 상단에 없던 변수 (터치용) — 컴포넌트 안에서 선언해도 OK
const touchStartX = { current: null as number | null };
