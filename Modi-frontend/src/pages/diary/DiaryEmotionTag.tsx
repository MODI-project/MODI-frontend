import styles from "./DiaryEmotionTag.module.css";
import Header from "../../components/common/Header";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";

const emotionList = [
  { en: "happy", ko: "기쁨" },
  { en: "surprised", ko: "놀람" },
  { en: "nervous", ko: "긴장" },
  { en: "normal", ko: "보통" },
  { en: "love", ko: "사랑" },
  { en: "excited", ko: "신남" },
  { en: "sad", ko: "슬픔" },
  { en: "sick", ko: "아픔" },
  { en: "bored", ko: "지루함" },
  { en: "angry", ko: "화남" },
];

const characterName = "momo"; //캐릭터 momo로 임시 설정

const DiaryEmotionTag = () => {
  const { draft, setDraft } = useDiaryDraft();
  const navigate = useNavigate();

  return (
    <div className={styles.DiaryEmotionTag_wrapper}>
      <div className={styles.DiaryEmotionTag_container}>
        <Header />
        <div className={styles.main_container}>
          <p className={styles.ask}>오늘은 어떤 하루였나요?</p>
          <div className={styles.img_container}>
            {emotionList.map((emotion) => {
              const isSelected = draft.emotion === emotion.en;
              const imageName = isSelected
                ? `clicked_${characterName}-${emotion.en}.svg`
                : `${characterName}-${emotion.en}.svg`;
              return (
                <div key={emotion.en} className={styles.emotion_item}>
                  <img
                    src={`/emotion_tag/${characterName}/${imageName}`}
                    alt={emotion.ko}
                    className={styles.emotion_image}
                    onClick={() => setDraft({ emotion: emotion.en })}
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
    </div>
  );
};

export default DiaryEmotionTag;
