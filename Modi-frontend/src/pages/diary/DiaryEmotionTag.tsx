import styles from "./DiaryEmotionTag.module.css";
import Header from "../../components/common/Header";
import Popup from "../../components/common/Popup";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import { useState, useEffect } from "react";
import { getDiaryById } from "../../apis/Diary/searchDiary";

const emotionList = [
  { en: "happy", ko: "기쁨" },
  { en: "surprised", ko: "놀람" },
  { en: "nervous", ko: "떨림" },
  { en: "normal", ko: "보통" },
  { en: "love", ko: "사랑" },
  { en: "excited", ko: "신남" },
  { en: "sad", ko: "슬픔" },
  { en: "sick", ko: "아픔" },
  { en: "bored", ko: "지루함" },
  { en: "angry", ko: "화남" },
];

const DiaryEmotionTag = () => {
  const { draft, setDraft, resetDraft } = useDiaryDraft();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [character, setCharacter] = useState("momo"); // ✅ 기본값 momo
  const navigate = useNavigate();
  const location = useLocation();

  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    navigate("/home");
  };

  // ✅ localStorage에서 character 불러오기
  useEffect(() => {
    const savedCharacter = localStorage.getItem("character");
    setCharacter(savedCharacter ?? "momo");
  }, []);

  useEffect(() => {
    const editId = location.state?.editDiaryId as number | undefined;

    if (!editId) {
      if (draft.mode === "edit" || draft.diaryId) resetDraft();
      return;
    }

    let alive = true;
    (async () => {
      try {
        resetDraft();

        const d = await getDiaryById(editId);
        if (!alive || !d) return;

        setDraft({
          mode: "edit",
          diaryId: editId,
          image: d.imageUrls?.[0] ?? null,
          imageFile: undefined,
          imageChanged: false,
          content: d.content ?? "",
          summary: d.summary ?? "",
          noEmotionSummary: d.summary ?? "",
          emotion: d.emotion?.name ?? null,
          address: d.location?.address ?? "",
          latitude: d.location?.latitude,
          longitude: d.location?.longitude,
          date: d.date ?? undefined,
          templateId: d.frameId ?? 1,
          font: d.font ?? "",
          keywords: (d.tags ?? []).map((t: { name: string }) => t.name),
          originalEmotion: d.emotion?.name ?? null,
          originalContent: d.content ?? "",
          originalAddress: d.location?.address ?? "",
          originalKeywords: (d.tags ?? []).map((t: { name: string }) => t.name),
          originalImage: d.imageUrls?.[0] ?? null,
        });
      } catch (e) {
        console.error("편집 데이터 불러오기 실패:", e);
        setDraft({ mode: "edit", diaryId: editId });
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <div className={styles.DiaryEmotionTag_wrapper}>
      <div className={styles.DiaryEmotionTag_container}>
        <Header
          left="/icons/back.svg"
          LeftClick={() => setIsPopupOpen(true)}
          middle="기록하기"
          right="/icons/X.svg"
          RightClick={() => setIsPopupOpen(true)}
        />
        <div className={styles.main_container}>
          <p className={styles.ask}>오늘은 어떤 하루였나요?</p>
          <div className={styles.img_container}>
            {emotionList.map((emotion) => {
              const isSelected = draft.emotion === emotion.ko;
              const imageName = isSelected
                ? `clicked_${character}-${emotion.en}.svg`
                : `${character}-${emotion.en}.svg`;
              return (
                <div key={emotion.en} className={styles.emotion_item}>
                  <img
                    src={`/emotion_tag/${character}/${imageName}`}
                    alt={emotion.ko}
                    className={styles.emotion_image}
                    onClick={() => setDraft({ emotion: emotion.ko })}
                  />
                  <span className={styles.emotion_label}>{emotion.ko}</span>
                </div>
              );
            })}
          </div>
        </div>
        <PrimaryButton
          location="next"
          label="다음"
          onClick={() => navigate("/detail")}
          disabled={!draft.emotion}
        />
      </div>

      {/* 팝업 */}
      {isPopupOpen && (
        <Popup
          title={[
            draft.mode === "edit"
              ? "수정된 기록이 저장되지 않아요!"
              : "작성된 기록이 저장되지 않아요!",
            "정말 종료하시겠어요?",
          ]}
          buttons={
            draft.mode === "edit"
              ? [
                  { label: "예", onClick: handlePopupConfirm },
                  { label: "아니오", onClick: () => setIsPopupOpen(false) },
                ]
              : [
                  { label: "아니오", onClick: () => setIsPopupOpen(false) },
                  { label: "예", onClick: handlePopupConfirm },
                ]
          }
        />
      )}
    </div>
  );
};

export default DiaryEmotionTag;
