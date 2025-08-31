import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGeolocation } from "../contexts/GeolocationContext";

// 알림 설정 상태를 확인하는 함수
const getNotificationSetting = (): boolean => {
  const notificationSetting = localStorage.getItem("notification_setting");
  return notificationSetting === "true";
};

export const useGeolocationControl = () => {
  const location = useLocation();
  const { startTracking, stopTracking } = useGeolocation();

  useEffect(() => {
    // 위치 추적은 항상 활성화 (앱 전체에서 필요한 기본 기능)
    // 알림 설정과 무관하게 위치 정보는 계속 수집
    startTracking();
  }, [location.pathname]); // 페이지 변경 시마다 위치 추적 상태 확인
};
