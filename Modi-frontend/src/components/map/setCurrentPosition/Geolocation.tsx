import React, { useState, useEffect, useRef } from "react";
import styles from "./Geolocation.module.css";

interface GeolocationProps {
  map?: any;
}

const Geolocation: React.FC<GeolocationProps> = ({ map }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  // map prop이 변경될 때마다 참조 업데이트
  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  // 권한 거부 상태를 localStorage에 저장하여 반복 시도 방지
  useEffect(() => {
    const denied = localStorage.getItem("geolocation_denied");
    if (denied === "true") {
      setPermissionDenied(true);
    }
  }, []);

  // 현재 위치 가져오기
  const getCurrentPosition = () => {
    console.log("=== getCurrentPosition 호출됨 ===");
    console.log("navigator.geolocation 지원 여부:", !!navigator.geolocation);
    console.log("mapRef.current 존재 여부:", !!mapRef.current);
    console.log("현재 URL:", window.location.href);
    console.log("HTTPS 여부:", window.location.protocol === "https:");

    if (!mapRef.current) {
      alert("지도가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);
    setPermissionDenied(false);

    // 권한 상태 확인 (새로운 브라우저에서 지원)
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          console.log("위치 권한 상태:", result.state);
          // 권한 상태를 localStorage에 저장
          localStorage.setItem("geolocation_permission", result.state);

          if (result.state === "denied") {
            console.warn("위치 권한이 거부됨");
            setPermissionDenied(true);
            setIsLoading(false);
            return;
          }
        })
        .catch((error) => {
          console.warn("권한 상태 확인 실패:", error);
        });
    }

    // 브라우저의 Geolocation API 사용
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // 성공 콜백
        (position) => {
          const { latitude, longitude } = position.coords;

          console.log("현재 위치:", { latitude, longitude });

          // 카카오맵 좌표로 변환
          const kakao = (window as any).kakao;
          if (kakao && kakao.maps) {
            const currentPos = new kakao.maps.LatLng(latitude, longitude);

            // 지도 중심을 현재 위치로 이동 (항상 정중앙에 위치)
            mapRef.current.setCenter(currentPos);

            // 기존 마커 제거
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // 새로운 마커 생성
            markerRef.current = new kakao.maps.Marker({
              position: currentPos,
              map: mapRef.current,
            });

            setCurrentPosition({ lat: latitude, lng: longitude });
            setIsLoading(false);
            // 성공 시 권한 거부 상태 제거
            localStorage.removeItem("geolocation_denied");
          }
        },
        // 에러 콜백
        (error) => {
          console.log("=== Geolocation 에러 발생 ===");
          console.log("에러 코드:", error.code);
          console.log("에러 메시지:", error.message);
          console.log("전체 에러 객체:", error);

          // HTTP 환경에서 권한이 허용되었는데도 에러가 발생하는 경우 처리
          const isHttpEnvironment = window.location.protocol !== "https:";
          const isPermissionGranted =
            localStorage.getItem("geolocation_permission") === "granted";

          if (
            isHttpEnvironment &&
            error.code === error.PERMISSION_DENIED &&
            isPermissionGranted
          ) {
            console.log(
              "HTTP 환경에서 권한 허용 후 에러 발생 - 무시하고 계속 진행"
            );
            return; // 에러를 무시하고 계속 진행
          }

          setIsLoading(false);
          let errorMessage = "위치 정보를 가져오는데 실패했습니다.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근이 거부되었습니다.";
              setPermissionDenied(true);
              localStorage.setItem("geolocation_denied", "true");
              console.warn("사용자가 위치 권한을 거부했습니다.");
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              console.warn("위치 정보를 사용할 수 없습니다.");
              break;
            case error.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              console.warn("위치 정보 요청 시간이 초과되었습니다.");
              break;
            default:
              errorMessage = "알 수 없는 오류가 발생했습니다.";
              console.warn("알 수 없는 Geolocation 오류:", error);
              break;
          }

          console.error("Geolocation error:", error);
        },
        // 옵션
        {
          enableHighAccuracy: true, // 높은 정확도
          maximumAge: 30000, // 30초 이내의 캐시된 위치 정보 사용
          timeout: 27000, // 27초 타임아웃
        }
      );
    } else {
      setIsLoading(false);
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  // 권한 상태 확인
  const checkPermissionStatus = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        console.log("위치 권한 상태:", result.state);
        if (result.state === "denied") {
          setPermissionDenied(true);
        }
      });
    }
  };

  // 권한 재요청
  const requestPermission = () => {
    setPermissionDenied(false);
    // localStorage에서 권한 거부 상태 제거
    localStorage.removeItem("geolocation_denied");
    getCurrentPosition();
  };

  return (
    <div className={styles.geolocation_container}>
      {permissionDenied ? (
        <div className={styles.permission_denied}>
          <button className={styles.retry_button} onClick={requestPermission}>
            위치 권한 재요청
          </button>
        </div>
      ) : (
        <button
          className={`${styles.myPos} ${isLoading ? styles.loading : ""}`}
          onClick={getCurrentPosition}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.loading_text}>위치 확인 중...</span>
          ) : (
            <></>
          )}
        </button>
      )}
    </div>
  );
};

export default Geolocation;
