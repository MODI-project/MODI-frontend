import styles from "./DiaryKeywordPage.module.css";
import Header from "../../components/common/Header";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate } from "react-router-dom";
import KeywordInput from "../../components/DiaryPage/DetailPage/KeywordInput";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";
import Popup from "../../components/common/Popup";
import { useState } from "react";

const DiaryKeywordPage = () => {
  const navigate = useNavigate();
  const { draft } = useDiaryDraft();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    navigate("/home");
  };

  return (
    <div className={styles.DiaryKeyword_wrapper}>
      <div className={styles.DiaryKeyword_container}>
        <Header
          left="/icons/back.svg"
          LeftClick={() => navigate(-1)}
          middle="일기 기록하기"
          right="/icons/X.svg"
          RightClick={() => setIsPopupOpen(true)}
        />

        <div className={styles.main_container}>
          <KeywordInput />
          {draft.keywords.length < 3 ? (
            <p className={styles.caution}>
              <img src="/icons/danger.svg" className={styles.caution_img} />
              키워드를 3개 이상 입력해주세요
            </p>
          ) : null}
          <FrequentKeywords Bigmargin={true} />
        </div>
        <PrimaryButton
          location="next"
          label="완료"
          onClick={() => navigate("/detail")}
          disabled={draft.keywords.length < 3}
        />
      </div>

      {/* 팝업 */}
      {isPopupOpen && (
        <Popup
          title={["작성한 일기가 저장되지 않아요!", "화면을 닫을까요?"]}
          buttons={[
            {
              label: "아니오",
              onClick: () => setIsPopupOpen(false),
            },
            {
              label: "예",
              onClick: handlePopupConfirm,
            },
          ]}
        />
      )}
    </div>
  );
};

export default DiaryKeywordPage;
