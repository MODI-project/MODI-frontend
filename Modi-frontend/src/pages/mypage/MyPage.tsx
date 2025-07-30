import React, { useState, useEffect } from "react";
import style from "./MyPage.module.css";
import Header from "../../components/common/Header";
import ProfileCard from "../../components/MyPage/Profile/ProfileCard";
import TabBar from "../../components/MyPage/TabBar";
import Footer from "../../components/common/Footer";
import FavoriteView from "./FavoriteView";
import StatsView from "./StatsView";
import { allDiaries, Diary } from "../../data/diaries";

const TAB_LABELS = ["즐겨찾기", "월간 일기"] as const;
type TabLabel = (typeof TAB_LABELS)[number];

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabLabel>("즐겨찾기");
  const [nickname, setNickname] = useState<string>("user123@email.com");

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  return (
    <div className={style.mypage_wrapper}>
      <div className={style.mypage_container}>
        <Header
          left="/icons/setting.svg"
          middle="마이페이지"
          right="/icons/notification_O.svg"
        />
        <div className={style.fixedHeader}>
          <div className={style.content}>
            <ProfileCard nickname={nickname} email="user123@email.com" />
          </div>
          <div className={style.tab_bar}>
            <TabBar selected={selectedTab} onSelect={setSelectedTab} />
          </div>
        </div>

        {selectedTab === "즐겨찾기" ? <FavoriteView /> : <StatsView />}
        <Footer />
      </div>
    </div>
  );
};

export default MyPage;
