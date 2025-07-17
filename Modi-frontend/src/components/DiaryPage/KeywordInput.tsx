import styles from "./KeywordInput.module.css";
import { useNavigate } from "react-router-dom";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";

const KeywordInput = () => {
  const navigate = useNavigate();
  const { draft, setDraft } = useDiaryDraft();

  return (
    <div className={styles.input_group}>
      <label className={styles.input_label}>키워드를 입력해주세요</label>
      <input
        type="text"
        placeholder="키워드를 3개 이상 입력해주세요"
        value={draft.keywords}
        onChange={(e) => setDraft({ keywords: e.target.value })}
        className={styles.input_field2}
        onClick={() => navigate("/keyword")}
      />
    </div>
  );
};

export default KeywordInput;
