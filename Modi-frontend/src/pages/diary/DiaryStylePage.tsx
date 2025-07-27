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
import { useNavigate } from "react-router-dom"; // ← react-router-dom 사용 가정

const DiaryStylePage = () => {
  const [selectedTab, setSelectedTab] = useState("한줄요약");
  const { draft } = useContext(DiaryDraftContext);
  const navigate = useNavigate();

  // 각 탭에서 조건 만족 여부
  const isSummaryDone = draft.summary && draft.font;
  const isLanguageStyleDone = draft.emotion && draft.summary;
  const isTemplateDone = draft.templateId !== null;

  // 버튼 활성화 여부 결정
  const isNextEnabled =
    (selectedTab === "한줄요약" && isSummaryDone) ||
    (selectedTab === "언어스타일" && isLanguageStyleDone) ||
    (selectedTab === "템플릿" && isTemplateDone);

  // 버튼 클릭 시 동작
  const handleNext = () => {
    if (selectedTab === "한줄요약") {
      setSelectedTab("언어스타일");
    } else if (selectedTab === "언어스타일") {
      setSelectedTab("템플릿");
    } else if (selectedTab === "템플릿" && isTemplateDone) {
      // 완료 → 디테일페이지로 이동
      navigate("/home"); // 일단 홈으로 설정
    }
  };

  return (
    <div className={styles.DiaryStyle_wrapper}>
      <div className={styles.DiaryStyle_container}>
        <Header
          left="/icons/back.svg"
          middle="일기 기록하기"
          right="/icons/X.svg"
          write={true}
        />
        <div className={styles.main_container}>
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
    </div>
  );
};

export default DiaryStylePage;
