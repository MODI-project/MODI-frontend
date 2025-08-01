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

  // 현재 위치 가져오기
  const getCurrentPosition = () => {
    if (!mapRef.current) {
      alert("지도가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);
    setPermissionDenied(false);

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

            // 지도 중심을 현재 위치로 이동
            mapRef.current.panTo(currentPos);

            // 기존 마커 제거
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // 새로운 마커 생성
            markerRef.current = new kakao.maps.Marker({
              position: currentPos,
              map: mapRef.current,
            });

            // 인포윈도우 생성 (선택사항)
            const infowindow = new kakao.maps.InfoWindow({
              content:
                '<div style="padding:5px;font-size:12px;">현재 위치</div>',
            });
            infowindow.open(mapRef.current, markerRef.current);

            // 3초 후 인포윈도우 자동 닫기
            setTimeout(() => {
              infowindow.close();
            }, 3000);

            setCurrentPosition({ lat: latitude, lng: longitude });
            setIsLoading(false);
          }
        },
        // 에러 콜백
        (error) => {
          setIsLoading(false);
          let errorMessage = "위치 정보를 가져오는데 실패했습니다.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "위치 정보 접근이 거부되었습니다.\n\n브라우저 설정에서 위치 정보 접근을 허용해주세요:\n\nChrome: 설정 → 개인정보 보호 및 보안 → 사이트 설정 → 위치 정보 → 허용\nSafari: 환경설정 → 웹사이트 → 위치 서비스 → 허용\nFirefox: 설정 → 개인정보 보호 및 보안 → 권한 → 위치 정보 → 허용";
              setPermissionDenied(true);
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

          alert(errorMessage);
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

  // 권한 재요청
  const requestPermission = () => {
    setPermissionDenied(false);
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
