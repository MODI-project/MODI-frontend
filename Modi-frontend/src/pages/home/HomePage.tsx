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
import { useGeolocationControl } from "../../hooks/useGeolocationControl";
import { useDongGeofence } from "../../hooks/useDongGeofence";
import { useNotificationManager } from "../../contexts/NotificationManagerContext";

import useLoadUserInfo, { MeResponse } from "../../apis/UserAPIS/loadUserInfo";

// URL에서 code 파라미터 추출 함수
const getCodeFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

export default function HomePage() {
  const { fetchUserInfo } = useLoadUserInfo();
  const [viewType, setViewType] = useState<"photo" | "polaroid">("polaroid");
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터에서 viewType 설정
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const viewParam = urlParams.get("view");
    if (viewParam === "photo" || viewParam === "polaroid") {
      setViewType(viewParam);
    }
  }, [location.search]);
  const [loading, setLoading] = useState(true);
  const [hasMonthData, setHasMonthData] = useState<boolean | null>(null); // 현재 달에 일기가 하나라도 있는지
  const isTokenRequesting = useRef(false); // 토큰 요청 중복 방지
  const [userInfo, setUserInfo] = useState<MeResponse | null>(null);
  // Geolocation 제어
  useGeolocationControl();

  // 지오펜스 및 알림 관리
  useDongGeofence();
  const { isEnabled, toggleNotifications } = useNotificationManager();

  // code 파라미터가 있으면 토큰 요청 처리 (중복 방지)
  useEffect(() => {
    const code = getCodeFromURL();
    console.log("=== OAuth 콜백 처리 시작 ===");
    console.log("현재 URL:", window.location.href);
    console.log("code 파라미터:", code);

    if (code && !isTokenRequesting.current) {
      isTokenRequesting.current = true;
      console.log("토큰 요청 시작:", code);

      handleTokenRequest(code)
        .then(async () => {
          console.log("토큰 요청 성공");
          // 토큰 요청 성공 후 사용자 정보 확인
          try {
            const userInfo = await fetchUserInfo();
            // 회원정보가 완성되어 있는지 확인 (nickname과 character가 모두 있는 경우)
            if (!userInfo.nickname || !userInfo.character) {
              // 신규 회원이므로 회원정보 입력 페이지로 리디렉션
              navigate("/information-setting", { state: { code } });
              return;
            }
            // 기존 회원이므로 홈에 머물러도 됨
            setUserInfo(userInfo);
          } catch (error) {
            // 사용자 정보 조회 실패 시 회원정보 입력 페이지로 리디렉션 (신규 회원일 가능성)
            navigate("/information-setting", { state: { code } });
          }
        })
        .catch((error) => {
          console.error("토큰 요청 실패:", error);
          navigate("/");
        })
        .finally(() => {
          isTokenRequesting.current = false;
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        });
    }
  }, [location, navigate, fetchUserInfo]);

  // code가 없을 때만 사용자 정보 로드 (code가 있으면 위의 useEffect에서 처리)
  useEffect(() => {
    const code = getCodeFromURL();
    // code가 있으면 토큰 요청 useEffect에서 처리하므로 여기서는 건너뜀
    if (code) {
      return;
    }

    const HomeLoading = async () => {
      try {
        const userInfo: MeResponse = await fetchUserInfo();
        setUserInfo(userInfo);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        // 에러 발생 시 로그인 페이지로 리디렉션
        navigate("/");
      }
    };
    HomeLoading();
  }, [navigate, fetchUserInfo]);

  // 월별 일기 조회
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
        setHasMonthData(false);
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
          right="/icons/notification_X.svg"
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
