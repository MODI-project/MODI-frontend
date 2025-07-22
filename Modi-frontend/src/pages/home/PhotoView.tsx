import React, { useState, useMemo } from "react";
import pageStyles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../../components/HomePage/HomeHeader/HomeHeader";
import DateSelector, {
  DiaryItem,
} from "../../components/HomePage/DateSelect/DateSelector";
import ButtonBar from "../../components/common/button/ButtonBar/PrimaryButton";
import Modal from "../../components/common/Modal";
import EmotionTab, {
  Emotion,
} from "../../components/HomePage/EmotionTab/EmotionTab";
import PhotoDiary from "../../components/HomePage/Diary/Photo/PhotoDiary";
import { useCharacter } from "../../contexts/CharacterContext";
import { allDiaries, Diary } from "../../data/diaries";

interface PhotoViewProps {
  onSwitchView: () => void;
}

export default function PhotoView({ onSwitchView }: PhotoViewProps) {
  const navigate = useNavigate();
  const { character } = useCharacter();

  const availableMonths = useMemo(() => {
    return Array.from(
      new Set(allDiaries.map((d) => d.date.slice(0, 7)))
    ).sort();
  }, []);
  const dateItems = availableMonths.map((d) => ({ date: d }));

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    return availableMonths.includes(thisMonth)
      ? thisMonth
      : availableMonths.at(-1)!;
  });

  const monthDiaries = useMemo(
    () => allDiaries.filter((d) => d.date.startsWith(viewDate)),
    [viewDate]
  );

  const emotionList: Emotion[] = Array.from(
    new Set(monthDiaries.map((d) => d.emotion))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const handlePrev = () => {
    const idx = availableMonths.indexOf(viewDate);
    if (idx > 0) {
      setViewDate(availableMonths[idx - 1]);
    }
  };
  const handleNext = () => {
    const idx = availableMonths.indexOf(viewDate);
    if (idx < availableMonths.length - 1) {
      setViewDate(availableMonths[idx + 1]);
    }
  };

  const filtered = selectedEmotion
    ? monthDiaries.filter((d) => d.emotion === selectedEmotion)
    : monthDiaries;

  return (
    <div className={pageStyles.wrapper}>
      {/* HomeHeader 에 props 로 상태·핸들러 내려주기 */}
      <HomeHeader
        viewType="photo"
        currentDate={viewDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenModal={() => setIsModalOpen(true)}
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

        {/* 사진 그리드 */}
        <div className={pageStyles.photoGrid}>
          {filtered.map((d) => (
            <PhotoDiary
              key={d.id}
              id={d.id}
              photoUrl={d.photoUrl}
              date={d.date}
              emotion={d.emotion}
              clicked={false}
            />
          ))}
        </div>
      </div>

      {/* 날짜 선택 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={pageStyles.modalInner}>
          <h3 className={pageStyles.modalTitle}>다른 날짜 일기 보기</h3>

          <DateSelector
            viewType="photo"
            items={dateItems}
            initialDate={viewDate}
            onChange={(newDate) => {
              setViewDate(newDate);
              setIsModalOpen(false);
            }}
            userCharacter={character!}
          />
        </div>
        <div className={pageStyles.footerWrapper}>
          <ButtonBar
            location="modal"
            label="확인"
            onClick={() => setIsModalOpen(false)}
            size="primary"
            disabled={false}
          />
        </div>
      </Modal>
    </div>
  );
}
