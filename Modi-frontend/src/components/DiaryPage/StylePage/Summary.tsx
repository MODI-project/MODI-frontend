import styles from "./Summary.module.css";
import FontStyle from "./FontStyle";
import { useState } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { useContext } from "react";

const Summary = () => {
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const [isFontStyleOpen, setIsFontStyleOpen] = useState(false);

  return (
    <div className={styles.Summary_container}>
      <button
        className={styles.Aa}
        onClick={() => setIsFontStyleOpen(!isFontStyleOpen)}
      >
        Aa
        <img src="/icons/drop.svg" />
      </button>
      {isFontStyleOpen && <FontStyle />}
      <input
        className={styles.content}
        value={draft.summary}
        onChange={(e) => setDraft({ summary: e.target.value })}
      />
      <div className={styles.autogen_button_wrapper}>
        <button className={styles.autogen_button}>
          <img src="/icons/rotate_gray.svg" /> 다시 생성하기
        </button>
      </div>
    </div>
  );
};

export default Summary;
