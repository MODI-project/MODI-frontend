import React, { useState, useMemo, useEffect, useRef } from "react";
import pageStyles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../../components/HomePage/HomeHeader/HomeHeader";
import DateSelector, {
  DiaryItem,
} from "../../components/HomePage/DateSelect/DateSelector";
import ButtonBar from "../../components/common/button/ButtonBar/PrimaryButton";
import EmotionTab, {
  Emotion,
} from "../../components/HomePage/EmotionTab/EmotionTab";
import PhotoDiary from "../../components/HomePage/Diary/Photo/PhotoDiary";
import { useCharacter } from "../../contexts/CharacterContext";
import type { DiaryData } from "../../components/common/frame/Frame";
import { fetchMonthlyDiaries } from "../../apis/Diary/diaries.read"; // 아까 만든 조회 파일
import Search from "../../components/HomePage/Diary/Photo/Search";
import DatePickerBottomSheet from "../../components/common/DatePickerBottomSheet";

interface PhotoViewProps {
  onSwitchView: () => void;
}

export default function PhotoView({ onSwitchView }: PhotoViewProps) {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { character } = useCharacter();
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const monthCache = useRef<Map<string, DiaryData[]>>(new Map());
  const [monthDiaries, setMonthDiaries] = useState<DiaryData[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const addMonths = (ym: string, delta: number) => {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  async function loadMonth(ym: string) {
    // 캐시 우선
    if (monthCache.current.has(ym)) {
      const cached = monthCache.current.get(ym)!;
      setMonthDiaries(cached);
      return cached;
    }
    const [year, month] = ym.split("-").map(Number);
    const list = await fetchMonthlyDiaries(year, month);
    monthCache.current.set(ym, list);
    return list;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await loadMonth(viewDate);
        setMonthDiaries(list);

        if (list.length > 0) {
          setAvailableMonths((prev) => {
            const s = new Set(prev);
            s.add(viewDate);
            return Array.from(s).sort(); // 정렬 기준은 팀 룰대로
          });
        }
      } catch (e) {
        console.error("월별 일기 로드 실패:", e);
        setMonthDiaries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [viewDate]);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const filtered = selectedEmotion
    ? monthDiaries.filter((d) => d.emotion === selectedEmotion)
    : monthDiaries;

  const [tempDate, setTempDate] = useState(viewDate);

  useEffect(() => {
    if (!isSheetOpen) return;
    (async () => {
      const tasks: Promise<void>[] = [];
      for (let d = -6; d <= 6; d++) {
        const ym = addMonths(viewDate, d);
        // 이미 알고 있는 월은 스킵
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
              /* 네트워크 실패 시 무시 */
            }
          })()
        );
      }
      await Promise.allSettled(tasks);
    })();
  }, [isSheetOpen]);

  const tryMove = async (dir: -1 | 1) => {
    let candidate = addMonths(viewDate, dir);
    // 최대 12개월 범위 내에서 탐색 (무한루프 방지)
    for (let i = 0; i < 12; i++) {
      // 캐시/프로빙
      let list = monthCache.current.get(candidate);
      if (!list) {
        try {
          list = await loadMonth(candidate);
        } catch {
          list = [];
        }
      }
      if (list.length > 0) {
        setViewDate(candidate);
        return;
      }
      candidate = addMonths(candidate, dir);
    }
  };

  const handlePrev = async () => {
    await tryMove(-1);
  };
  const handleNext = async () => {
    await tryMove(1);
  };

  const monthList = availableMonths;
  const dateItems = useMemo(
    () => monthList.map((date) => ({ date })),
    [monthList]
  );

  const handleConfirm = () => {
    // monthList에 없는 tempDate라도 setViewDate → loadMonth → length>0이면 availableMonths에 추가됨
    setViewDate(tempDate);
    setIsSheetOpen(false);
  };

  const handleDiaryClick = (diary: DiaryData) => {
    navigate(`/recorddetail/`, {
      state: {
        diaryId: diary.id,
        diaryData: diary,
      },
    });
  };

  useEffect(() => {
    // 월(viewDate) 바뀔 때 감정 필터 초기화
    setSelectedEmotion(null);
  }, [viewDate]);

  return (
    <div className={pageStyles.wrapper}>
      {/* HomeHeader 에 props 로 상태·핸들러 내려주기 */}
      <HomeHeader
        viewType="photo"
        currentDate={viewDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenModal={() => setIsSheetOpen(true)}
        onSwitchView={onSwitchView}
      />
      <div className={pageStyles.content}>
        {/* 감정 탭 */}
        <div className={pageStyles.emotionTab}>
          <EmotionTab
            selectedEmotion={selectedEmotion}
            onSelectEmotion={setSelectedEmotion}
            userCharacter={character!}
          />
        </div>

        {filtered.length > 0 ? (
          !loading && (
            <div className={pageStyles.photoGrid}>
              {filtered.map((d) => (
                <PhotoDiary
                  key={d.id}
                  id={d.id}
                  photoUrl={d.photoUrl}
                  date={d.date}
                  emotion={d.emotion}
                  clicked={false}
                  onClick={() => handleDiaryClick(d)}
                />
              ))}
            </div>
          )
        ) : (
          <div className={pageStyles.emptyState}>
            <Search />
          </div>
        )}

        {/* 날짜 선택 모달 */}
        <DatePickerBottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          minimizeOnDrag={false}
        >
          <div className={pageStyles.modalInner}>
            <h3 className={pageStyles.modalTitle}>다른 날짜 일기 보기</h3>

            <DateSelector
              viewType="photo"
              items={dateItems}
              initialDate={tempDate}
              onChange={(d) => setTempDate(d)}
              userCharacter={character!}
            />
          </div>
          <div className={pageStyles.footerWrapper}>
            <ButtonBar
              location="modal"
              label="확인"
              onClick={handleConfirm}
              size="primary"
              disabled={false}
            />
          </div>
        </DatePickerBottomSheet>
      </div>
    </div>
  );
}
