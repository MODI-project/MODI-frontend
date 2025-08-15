import React, { useState, useEffect, useRef } from "react";
import style from "./HomePage.module.css";
import Footer from "../../components/common/Footer";

import PolaroidView from "./PolaroidView";
import PhotoView from "./PhotoView";

import Header from "../../components/common/Header";
import { fetchMonthlyDiaries } from "../../apis/Diary/diaries.read";
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
  const [loading, setLoading] = useState(true);
  const [hasMonthData, setHasMonthData] = useState<boolean | null>(null); // 현재 달에 일기가 하나라도 있는지
  const isTokenRequesting = useRef(false); // 토큰 요청 중복 방지

  // code 파라미터가 있으면 토큰 요청 처리 (중복 방지)
  useEffect(() => {
    const code = getCodeFromURL();
    if (code && !isTokenRequesting.current) {
      console.log("=== 홈 페이지에서 code 파라미터 감지 ===");
      console.log("code:", code);
      console.log("기존 회원이므로 토큰 요청 처리");

      isTokenRequesting.current = true;

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
          isTokenRequesting.current = false;
          // URL에서 code 파라미터 제거
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        });
    }
  }, [location]); // navigate 의존성 제거

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const list = await fetchMonthlyDiaries(year, month);
        setHasMonthData(list.length > 0);
      } catch (e) {
        console.error("월별 일기 조회 실패:", e);
        setHasMonthData(false); // 실패 시 일단 빈 상태로 처리(원하면 에러 UI 분리)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              불러오는 중...
            </div>
          ) : hasMonthData === false ? (
            <EmptyDiaryView />
          ) : viewType === "photo" ? (
            <PhotoView onSwitchView={() => setViewType("polaroid")} />
          ) : (
            <PolaroidView onSwitchView={() => setViewType("photo")} />
          )}
        </main>
        <Footer showBalloon={hasMonthData === false} />
      </div>
    </div>
  );
}
