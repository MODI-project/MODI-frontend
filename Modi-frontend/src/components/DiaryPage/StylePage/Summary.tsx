import styles from "./Summary.module.css";
import FontStyle from "./FontStyle";
import { useState, useContext } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { generateSummary } from "../../../apis/Diary/summary";

const Summary = () => {
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const [isFontStyleOpen, setIsFontStyleOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!draft.content || !draft.content.trim()) {
      alert(
        "일기 본문이 비어 있어요. 본문을 먼저 작성하거나 자동생성 해주세요."
      );
      return;
    }
    if (regenerating) return;

    try {
      setRegenerating(true);
      const s = await generateSummary(draft.content.trim());
      if (s && s.trim()) {
        setDraft({ noEmotionSummary: s.trim() });
      } else {
        alert("요약 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
      }
    } catch (e) {
      console.error("요약 재생성 실패:", e);
      alert("요약 생성 중 오류가 발생했어요. 콘솔을 확인해주세요.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className={styles.Summary_container}>
      <button
        className={styles.Aa}
        onClick={() => setIsFontStyleOpen(!isFontStyleOpen)}
        type="button"
      >
        Aa
        <img src="/icons/drop.svg" />
      </button>

      {isFontStyleOpen && <FontStyle />}

      <input
        className={styles.content}
        value={draft.noEmotionSummary ?? ""}
        onChange={(e) => setDraft({ noEmotionSummary: e.target.value })}
        placeholder="한 줄 요약이 여기에 표시돼요"
      />

      <div className={styles.autogen_button_wrapper}>
        <button
          className={styles.autogen_button}
          onClick={handleRegenerate}
          disabled={regenerating}
          type="button"
        >
          <img src="/icons/rotate_gray.svg" />
          {regenerating ? "생성 중..." : "다시 생성하기"}
        </button>
      </div>
    </div>
  );
};

export default Summary;
