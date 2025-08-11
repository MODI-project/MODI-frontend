import React, { useState, useEffect } from "react";
import style from "./HomePage.module.css";
import Footer from "../../components/common/Footer";

import PolaroidView from "./PolaroidView";
import PhotoView from "./PhotoView";

import Header from "../../components/common/Header";
import { mockDiaries } from "../../apis/diaryInfo"; // 또는 상태 관리 데이터
import EmptyDiaryView from "./EmptyDiaryView";
import { useNavigate, useLocation } from "react-router-dom";
import { handleTokenRequest } from "../../apis/UserAPIS/tokenRequest";

// URL에서 code 파라미터 추출 함수
const getCodeFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

export default function HomePage() {
  const [viewType, setViewType] = useState<"photo" | "polaroid">("polaroid");
  const navigate = useNavigate();
  const location = useLocation();

  // code 파라미터가 있으면 토큰 요청 처리
  useEffect(() => {
    const code = getCodeFromURL();
    if (code) {
      console.log("=== 홈 페이지에서 code 파라미터 감지 ===");
      console.log("code:", code);
      console.log("기존 회원이므로 토큰 요청 처리");

      // 토큰 요청 API 호출
      handleTokenRequest(code)
        .then(() => {
          console.log("✅ 토큰 요청 완료");
        })
        .catch((error) => {
          console.error("❌ 토큰 요청 실패:", error);
          navigate("/login");
        })
        .finally(() => {
          // URL에서 code 파라미터 제거
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        });
    }
  }, [location, navigate]);
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
