import styles from "./DiaryStylePage.module.css";
import Header from "../../components/common/Header";
import BottomSheet from "../../components/common/BottomSheet";
import Tab from "../../components/common/tab/Tab";
import { useState } from "react";
import Summary from "../../components/DiaryPage/StylePage/Summary";
import LanguageStyle from "../../components/DiaryPage/StylePage/LanguageStyle";
import Template from "../../components/DiaryPage/StylePage/Template";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useContext } from "react";
import { DiaryDraftContext } from "../../contexts/DiaryDraftContext";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/common/Popup";
import Preview from "../../components/DiaryPage/StylePage/Preview";
import { postDiary } from "../../apis/Diary/postDiary";

const DiaryStylePage = () => {
  const [selectedTab, setSelectedTab] = useState("한줄요약");
  const { draft } = useContext(DiaryDraftContext);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    navigate("/home");
  };

  // 버튼 활성화 여부 결정
  const isNextEnabled =
    !submitting &&
    (selectedTab === "한줄요약"
      ? !!(draft.font && draft.noEmotionSummary)
      : selectedTab === "언어스타일"
      ? !!(draft.emotion && draft.summary)
      : !!(
          draft.font &&
          draft.noEmotionSummary &&
          draft.emotion &&
          draft.summary &&
          draft.templateId !== null
        ));

  // 버튼 클릭 시 동작
  const handleNext = async () => {
    if (selectedTab === "한줄요약") {
      setSelectedTab("언어스타일");
      return;
    }
    if (selectedTab === "언어스타일") {
      setSelectedTab("템플릿");
      return;
    }
    if (selectedTab === "템플릿") {
      try {
        setSubmitting(true);
        const res = await postDiary(draft);
        console.log(res.message);

        navigate("/recorddetail");
      } catch (e) {
        console.error(e);
        alert("기록 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.DiaryStyle_wrapper}>
      <div className={styles.DiaryStyle_container}>
        <Header
          left="/icons/back.svg"
          LeftClick={() => navigate(-1)}
          middle="기록 작성하기"
          right="/icons/X.svg"
          RightClick={() => setIsPopupOpen(true)}
        />
        <div className={styles.main_container}>
          <Preview />
          <BottomSheet isOpen={true} onClose={() => {}} minimizeOnDrag={true}>
            <div className={styles.tab_container}>
              <Tab
                label="한줄요약"
                selected={selectedTab === "한줄요약"}
                onClick={() => setSelectedTab("한줄요약")}
              />
              <Tab
                label="언어스타일"
                selected={selectedTab === "언어스타일"}
                onClick={() => setSelectedTab("언어스타일")}
              />
              <Tab
                label="템플릿"
                selected={selectedTab === "템플릿"}
                onClick={() => setSelectedTab("템플릿")}
              />
            </div>
            {selectedTab === "한줄요약" ? (
              <Summary />
            ) : selectedTab === "언어스타일" ? (
              <LanguageStyle />
            ) : (
              <Template />
            )}
            <PrimaryButton
              location="next"
              label={selectedTab === "템플릿" ? "완료" : "다음"}
              onClick={handleNext}
              disabled={!isNextEnabled}
            />
          </BottomSheet>
        </div>
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

export default DiaryStylePage;
