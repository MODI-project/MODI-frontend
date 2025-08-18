import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { reverseToDong } from "../apis/MapAPIS/reverseGeocode";

interface GeolocationState {
  lat: number;
  lng: number;
  address?: string;
  dong?: string;
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

interface GeolocationContextType extends GeolocationState {
  startTracking: () => void;
  stopTracking: () => void;
  requestPermission: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined
);

interface GeolocationProviderProps {
  children: React.ReactNode;
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({
  children,
}) => {
  // 알림 설정 상태를 확인하는 함수
  const getNotificationSetting = (): boolean => {
    const notificationSetting = localStorage.getItem("notification_setting");
    return notificationSetting === "true";
  };

  // 기본적으로 비활성화 상태로 시작
  const enabled = false;
  const [state, setState] = useState<GeolocationState>({
    lat: 0,
    lng: 0,
    address: undefined,
    dong: undefined,
    isTracking: false,
    isLoading: false,
    error: null,
    permissionDenied: false,
  });

  const watchIdRef = useRef<number | null>(null);

  // 권한 상태 확인
  useEffect(() => {
    const denied = localStorage.getItem("geolocation_permission");
    if (denied === "denied") {
      setState((prev) => ({ ...prev, permissionDenied: true }));
    }
  }, []);

  // 위치 추적 시작
  const startTracking = useCallback(() => {
    // 이미 추적 중이면 중복 시작 방지
    if (state.isTracking || watchIdRef.current !== null) {
      console.log("이미 위치 추적 중입니다.");
      return;
    }

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "이 브라우저에서는 위치 정보를 지원하지 않습니다.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // 권한 상태 확인
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          localStorage.setItem("geolocation_permission", result.state);
          if (result.state === "denied") {
            setState((prev) => ({
              ...prev,
              permissionDenied: true,
              isLoading: false,
            }));
            return;
          }
        })
        .catch((error) => {
          console.warn("권한 상태 확인 실패:", error);
        });
    }

    // 위치 추적 시작
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 역지오코딩으로 주소 정보 가져오기
          const geocodeResult = await reverseToDong(latitude, longitude);
          const address = geocodeResult?.fullAddress || geocodeResult?.dong;

          setState((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address,
            dong: geocodeResult?.dong,
            isTracking: true,
            isLoading: false,
            error: null,
          }));

          console.log(`현위치 : ${address}`);
        } catch (error) {
          console.error("[역지오코딩] 실패:", error);
          setState((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            isTracking: true,
            isLoading: false,
            error: null,
          }));
        }
      },
      (error) => {
        console.log("=== Geolocation 에러 발생 ===");
        console.log("에러 코드:", error.code);
        console.log("에러 메시지:", error.message);

        let errorMessage = "위치 정보를 가져오는데 실패했습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.";
            setState((prev) => ({
              ...prev,
              permissionDenied: true,
              isLoading: false,
              error: errorMessage,
            }));
            localStorage.setItem("geolocation_permission", "denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류가 발생했습니다.";
            break;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 27000,
      }
    );
  }, []);

  // 위치 추적 중지
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setState((prev) => ({ ...prev, isTracking: false }));
    }
  }, []);

  // 권한 재요청
  const requestPermission = useCallback(() => {
    setState((prev) => ({ ...prev, permissionDenied: false }));
    startTracking();
  }, [startTracking]);

  // enabled 조건에 따라 자동 시작/중지
  useEffect(() => {
    if (enabled && !state.isTracking && !state.permissionDenied) {
      startTracking();
    } else if (!enabled && state.isTracking) {
      stopTracking();
    }
  }, [
    enabled,
    state.isTracking,
    state.permissionDenied,
    startTracking,
    stopTracking,
  ]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const value: GeolocationContextType = {
    ...state,
    startTracking,
    stopTracking,
    requestPermission,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};

// Hook
export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error("useGeolocation must be used within a GeolocationProvider");
  }
  return context;
};
