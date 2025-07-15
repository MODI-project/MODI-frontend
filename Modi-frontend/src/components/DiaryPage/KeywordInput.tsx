import styles from "./KeywordInput.module.css";
import { useNavigate } from "react-router-dom";

interface KeywordInputType {
  keywords: string;
  setKeywords: React.Dispatch<React.SetStateAction<string>>;
}

const KeywordInput = ({ keywords, setKeywords }: KeywordInputType) => {
  const navigate = useNavigate();

  return (
    <div className={styles.input_group}>
      <label className={styles.input_label}>키워드를 입력해주세요</label>
      <input
        type="text"
        placeholder="키워드를 3개 이상 입력해주세요"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className={styles.input_field2}
        onClick={() => navigate("/keyword")}
      />
    </div>
  );
};

export default KeywordInput;
