import { useEffect, useRef } from "react";
import { useGeolocation } from "../contexts/GeolocationContext";

// 알림 설정 상태를 확인하는 함수
const getNotificationSetting = (): boolean => {
  const notificationSetting = localStorage.getItem("notification_setting");
  return notificationSetting === "true";
};

export const useNotificationControl = () => {
  const { lat, lng, address } = useGeolocation();
  const notificationEnabledRef = useRef<boolean>(false);

  useEffect(() => {
    // 알림 설정 상태 확인
    const notificationEnabled = getNotificationSetting();
    notificationEnabledRef.current = notificationEnabled;

    // 알림이 켜져있고 위치 정보가 있으면 알림 로직 실행
    if (notificationEnabled && lat && lng) {
      console.log("알림 활성화됨 - 위치:", { lat, lng, address });
      // 여기에 실제 알림 로직 추가
      // 예: 특정 위치 근처에 있을 때 알림 표시
    }
  }, [lat, lng, address]); // 위치 정보가 변경될 때마다 알림 상태 확인

  // 알림 설정 변경 시 호출할 함수
  const handleNotificationSettingChange = (enabled: boolean) => {
    notificationEnabledRef.current = enabled;
    if (enabled && lat && lng) {
      console.log("알림 설정 변경됨 - 활성화:", { lat, lng, address });
      // 알림 활성화 로직
    }
  };

  return {
    isNotificationEnabled: notificationEnabledRef.current,
    handleNotificationSettingChange,
  };
};
