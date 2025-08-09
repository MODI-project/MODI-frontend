import React, { useState } from "react";
import style from "./HomePage.module.css";
import Footer from "../../components/common/Footer";

import PolaroidView from "./PolaroidView";
import PhotoView from "./PhotoView";

import Header from "../../components/common/Header";
import { mockDiaries } from "../../apis/diaryInfo"; // 또는 상태 관리 데이터
import EmptyDiaryView from "./EmptyDiaryView";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [viewType, setViewType] = useState<"photo" | "polaroid">("polaroid");
  const navigate = useNavigate();
  return (
    <div className={style.home_wrapper}>
      <div className={style.home_container}>
        <Header
          left="/images/logo/Modi.svg"
          right="/icons/notification_O.svg"
          RightClick={() => {
            navigate("/notification");
          }}
        />

        <main className={style.mainContent}>
          {mockDiaries.length === 0 ? (
            <EmptyDiaryView />
          ) : viewType === "photo" ? (
            <PhotoView onSwitchView={() => setViewType("polaroid")} />
          ) : (
            <PolaroidView onSwitchView={() => setViewType("photo")} />
          )}
        </main>
        <Footer showBalloon={mockDiaries.length === 0} />
      </div>
    </div>
  );
}
