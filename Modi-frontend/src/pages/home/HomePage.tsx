import React, { useState } from "react";
import style from "./HomePage.module.css";
import Footer from "../../components/common/Footer";

import PolaroidView from "./PolaroidView";
import PhotoView from "./PhotoView";

import Header from "../../components/common/Header";
import { allDiaries } from "../../data/diaries"; // 또는 상태 관리 데이터
import EmptyDiaryView from "./EmptyDiaryView";

export default function HomePage() {
  const [viewType, setViewType] = useState<"photo" | "polaroid">("polaroid");
  return (
    <div className={style.home_wrapper}>
      <div className={style.home_container}>
        <Header
          left="/images/logo/Modi.svg"
          right="/icons/notification_O.svg"
        />

        <main className={style.mainContent}>
          {allDiaries.length === 0 ? (
            <EmptyDiaryView />
          ) : viewType === "photo" ? (
            <PhotoView onSwitchView={() => setViewType("polaroid")} />
          ) : (
            <PolaroidView onSwitchView={() => setViewType("photo")} />
          )}
        </main>
        <Footer showBalloon={allDiaries.length === 0} />
      </div>
    </div>
  );
}
