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
  const [monthDiaries, setMonthDiaries] = useState<DiaryData[]>([]);
  const [loading, setLoading] = useState(false);

  const dateItems = useMemo(() => {
    // monthDiaries에서 날짜(연월)만 추출
    const uniqueMonths = Array.from(
      new Set(monthDiaries.map((diary) => diary.date.slice(0, 7)))
    );
    return uniqueMonths.map((date) => ({ date }));
  }, [monthDiaries]);

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [year, month] = viewDate.split("-").map(Number);
        const list = await fetchMonthlyDiaries(year, month);
        setMonthDiaries(list);
      } catch (e) {
        console.error("월별 일기 로드 실패:", e);
        setMonthDiaries([]); // 실패 시 빈 배열
      } finally {
        setLoading(false);
      }
    })();
  }, [viewDate]);

  const emotionList = Array.from(
    new Set(monthDiaries.map((d) => d.emotion))
  ) as Emotion[];

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const monthList = dateItems.map((item) => item.date);

  const handlePrev = () => {
    const idx = monthList.indexOf(viewDate);
    if (idx > 0) {
      setViewDate(monthList[idx - 1]);
    }
  };

  const handleNext = () => {
    const idx = monthList.indexOf(viewDate);
    if (idx < monthList.length - 1) {
      setViewDate(monthList[idx + 1]);
    }
  };

  const filtered = selectedEmotion
    ? monthDiaries.filter((d) => d.emotion === selectedEmotion)
    : monthDiaries;

  const [tempDate, setTempDate] = useState(viewDate);

  const handleConfirm = () => {
    setViewDate(tempDate);
    setIsSheetOpen(false);
  };

  useEffect(() => {
    if (isSheetOpen) {
      setTempDate(viewDate);
    }
  }, [isSheetOpen, viewDate]);

  const handleDiaryClick = (diary: DiaryData) => {
    navigate(`/recorddetail/`, {
      state: {
        diaryId: diary.id,
        diaryData: diary,
      },
    });
  };

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
