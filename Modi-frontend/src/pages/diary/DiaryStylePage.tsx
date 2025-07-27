import styles from "./DiaryStylePage.module.css";
import Header from "../../components/common/Header";
import BottomSheet from "../../components/common/BottomSheet";
import Tab from "../../components/common/tab/Tab";
import { useState } from "react";
import Summary from "../../components/DiaryPage/LanguageStyle/Summary";
import LanguageStyle from "../../components/DiaryPage/LanguageStyle/LanguageStyle";
import Template from "../../components/DiaryPage/LanguageStyle/Template";

const DiaryStylePage = () => {
  const [selectedTab, setSelectedTab] = useState("한줄요약");

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
          </BottomSheet>
        </div>
      </div>
    </div>
  );
};

export default DiaryStylePage;
