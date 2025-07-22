import styles from "./DiaryKeywordPage.module.css";
import Header from "../../components/common/Header";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate } from "react-router-dom";
import KeywordInput from "../../components/DiaryPage/KeywordInput";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";

const DiaryKeywordPage = () => {
  const navigate = useNavigate();
  const { draft } = useDiaryDraft();

  return (
    <div className={styles.DiaryKeyword_wrapper}>
      <div className={styles.DiaryKeyword_container}>
        <Header
          left="/icons/back.svg"
          middle="일기 기록하기"
          right="/icons/X.svg"
          write={true}
        />
        <div className={styles.main_container}>
          <KeywordInput />
          {draft.keywords.length < 3 ? (
            <p className={styles.caution}>
              <img src="/icons/danger.svg" className={styles.caution_img} />
              키워드를 3개 이상 입력해주세요
            </p>
          ) : null}
          <FrequentKeywords />
        </div>
        <PrimaryButton
          location="next"
          label="완료"
          onClick={() => navigate("/detail")}
          disabled={draft.keywords.length < 3}
        />
      </div>
    </div>
  );
};

export default DiaryKeywordPage;
