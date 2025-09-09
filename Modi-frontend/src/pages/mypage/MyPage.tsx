import React, { useState, useEffect } from "react";
import style from "./MyPage.module.css";
import Header from "../../components/common/Header";
import ProfileCard from "../../components/MyPage/Profile/ProfileCard";
import TabBar from "../../components/MyPage/TabBar";
import Footer from "../../components/common/Footer";
import FavoriteView from "./FavoriteView";
import StatsView from "./StatsView";
import { useNavigate } from "react-router-dom";
import useLoadUserInfo, { MeResponse } from "../../apis/UserAPIS/loadUserInfo";
import { useGeolocationControl } from "../../hooks/useGeolocationControl";

const TAB_LABELS = ["즐겨찾기", "월간 일기"] as const;
type TabLabel = (typeof TAB_LABELS)[number];

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabLabel>("즐겨찾기");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Geolocation 제어
  useGeolocationControl();

  useEffect(() => {
    const userInfoLoading = async () => {
      const userInfo: MeResponse = await useLoadUserInfo().userInfo();
      setNickname(userInfo.nickname);
      setEmail(userInfo.email);
    };
    userInfoLoading();
  }, []);

  if (loading) return <div className={style.skeleton}>로딩중...</div>;

  return (
    <div className={style.mypage_wrapper}>
      <div className={style.mypage_container}>
        <Header
          left="/icons/setting.svg"
          middle="마이페이지"
          right="/icons/notification_X.svg"
          LeftClick={() => {
            navigate("/setting");
          }}
          RightClick={() => {
            navigate("/notification");
          }}
        />
        <div className={style.fixedHeader}>
          <div className={style.content}>
            <ProfileCard nickname={nickname} email={email} />
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
