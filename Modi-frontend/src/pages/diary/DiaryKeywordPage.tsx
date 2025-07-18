import styles from "./DiaryKeywordPage.module.css";
import Header from "../../components/common/Header";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate } from "react-router-dom";
import KeywordInput from "../../components/DiaryPage/KeywordInput";

const DiaryKeywordPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.DiaryKeyword_wrapper}>
      <div className={styles.DiaryKeyword_container}>
        <Header />
        <div className={styles.main_container}>
          <KeywordInput />
        </div>
        <PrimaryButton
          location="next"
          label="완료"
          onClick={() => navigate("/detail")}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default DiaryKeywordPage;
