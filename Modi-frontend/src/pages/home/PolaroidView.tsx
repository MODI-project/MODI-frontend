import { useState, useMemo, useEffect, useRef } from "react";
import pageStyles from "./HomePage.module.css";
import HomeHeader from "../../components/HomePage/HomeHeader/HomeHeader";
import DateSelector, {
  DiaryItem,
} from "../../components/HomePage/DateSelect/DateSelector";
import ButtonBar from "../../components/common/button/ButtonBar/PrimaryButton";
import BottomSheet from "../../components/common/BottomSheet";
import PolaroidFrame from "../../components/HomePage/Diary/Polaroid/PolaroidFrame";
import EmotionCharacter from "../../components/HomePage/Diary/Polaroid/EmotionCharacter";
import EmotionTagList from "../../components/HomePage/Diary/Polaroid/EmotionTagList";
import { useCharacter } from "../../contexts/CharacterContext";
// 목업 데이터 사용 (아래 3개)
import { mockFetchDiaries } from "../../apis/diaryInfo";
import { DiaryData } from "../../components/common/frame/Frame";
import { Emotion } from "../../data/diaries";

interface PolaroidViewProps {
  onSwitchView: () => void;
}

export default function PolaroidView({ onSwitchView }: PolaroidViewProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // 목업 데이터 사용 (아래 2개)
  const [mockDiaries, setMockDiaries] = useState<DiaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const hasOpened = useRef(false);
  const { character } = useCharacter();

  const allDates = useMemo(
    // () => allDiaries.map((d) => d.date).sort((a, b) => a.localeCompare(b)),
    // []
    () => {
      const dates = mockDiaries
        .map((d) => d.date)
        .sort((a, b) => a.localeCompare(b));
      console.log("allDates 계산:", dates);
      return dates;
    },
    [mockDiaries]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewDate = allDates[currentIndex] || allDates[0] || "";
  // 현재 인덱스 (안전하게 처리)
  const currentIdx = allDates.length > 0 ? allDates.indexOf(viewDate) : -1;

  // 보여줄 날짜: 가장 최근이 오른쪽 (목업 데이터 사용! allDiaries 대신 mockDiaries만 바꾼 것!)
  const slots =
    allDates.length > 0
      ? [
          currentIdx > 0
            ? mockDiaries.find((d) => d.date === allDates[currentIdx - 1]) ||
              null
            : null,
          mockDiaries.find((d) => d.date === viewDate) || null,
          currentIdx < allDates.length - 1
            ? mockDiaries.find((d) => d.date === allDates[currentIdx + 1]) ||
              null
            : null,
        ]
      : [null, null, null];

  console.log("slots 계산:", {
    allDatesLength: allDates.length,
    currentIdx,
    viewDate,
    slots: slots.map((slot) => (slot ? slot.summary : null)),
  });

  // 목업 데이터 로드
  useEffect(() => {
    const loadMockData = async () => {
      try {
        console.log("목업 데이터 로드 시작");
        const data = await mockFetchDiaries();
        console.log("목업 데이터 로드 완료:", data);
        setMockDiaries(data);
        // 데이터 로드 후 최신 일기가 가운데에 오도록 인덱스 설정
        setCurrentIndex(Math.max(0, data.length - 1));
        console.log("currentIndex 설정:", Math.max(0, data.length - 1));
      } catch (error) {
        console.error("목업 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMockData();
  }, []);

  // 현재 일기 데이터 (목업 데이터 사용)
  const currentDiary =
    mockDiaries.find((d) => d.date === viewDate) || mockDiaries[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < allDates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (isSheetOpen) {
      hasOpened.current = false;
    }
  }, [isSheetOpen]);

  const handleChange = (newDate: string) => {
    const newIndex = allDates.indexOf(newDate);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }

    if (hasOpened.current) {
      setIsSheetOpen(false); // 두 번째 이후부터 닫힘
    } else {
      hasOpened.current = true; // 첫 호출은 무시
    }
  };

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      // 왼쪽으로 스와이프 → 다음
      handleNext();
    } else if (distance < -50) {
      // 오른쪽으로 스와이프 → 이전
      handlePrev();
    }

    // 초기화
    touchStartX.current = null;
    touchEndX.current = null;
  };

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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={pageStyles.carouselInner}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slots.map((d, i) => (
              <div key={i} className={pageStyles[`slot${i + 1}`]}>
                {d ? (
                  <PolaroidFrame diaryData={d} diaryId={d.id} />
                ) : (
                  <div className={pageStyles.emptySlot} />
                )}
              </div>
            ))}
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
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        minimizeOnDrag={true} // 드래그 시 최소화 기능 원하면 true
      >
        <div className={pageStyles.modalInner}>
          <h3 className={pageStyles.modalTitle}>다른 날짜 일기 보기</h3>

          <DateSelector
            viewType="polaroid"
            items={allDates.map((d) => ({ date: d }))}
            initialDate={viewDate}
            onChange={handleChange}
            userCharacter={character!}
          />
        </div>
        <div className={pageStyles.footerWrapper}>
          <ButtonBar
            location="modal"
            label="확인"
            onClick={() => setIsSheetOpen(false)}
            size="primary"
            disabled={false}
          />
        </div>
      </BottomSheet>
    </div>
  );
}
