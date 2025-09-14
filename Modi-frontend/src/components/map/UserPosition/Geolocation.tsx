import React, { useEffect, useRef } from "react";
import styles from "./Geolocation.module.css";
import { useGeolocation } from "../../../contexts/GeolocationContext";

interface GeolocationProps {
  map?: any;
  onCurrentPositionChange?: (position: {
    lat: number;
    lng: number;
    address?: string;
  }) => void;
}

const Geolocation: React.FC<GeolocationProps> = ({
  map,
  onCurrentPositionChange,
}) => {
  const {
    lat,
    lng,
    address,
    isTracking,
    isLoading,
    error,
    permissionDenied,
    startTracking,
    stopTracking,
    requestPermission,
  } = useGeolocation();

  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const locationCircleRef = useRef<any>(null);

  // map prop이 변경될 때마다 참조 업데이트
  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  // 현재 위치가 변경될 때마다 상위 컴포넌트에 알림
  useEffect(() => {
    if (lat && lng && onCurrentPositionChange) {
      onCurrentPositionChange({
        lat,
        lng,
        address,
      });
    }
  }, [lat, lng, address, onCurrentPositionChange]);

  // 현재 위치가 있을 때 지도에 표시
  useEffect(() => {
    if (lat && lng && mapRef.current) {
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        const currentPos = new kakao.maps.LatLng(lat, lng);

        // 현재 위치 Circle 생성
        createLocationCircle(currentPos);

        // 펄스 Circle 애니메이션 생성
        createPulseCircle(currentPos);
      }
    }
  }, [lat, lng]);

  // 줌 레벨에 따른 Circle 반지름 계산
  const getCircleRadius = (baseRadius: number) => {
    if (!mapRef.current) return baseRadius;

    const currentLevel = mapRef.current.getLevel();

    // 카카오맵처럼 줌 레벨에 따라 화면상 일정한 크기로 보이도록 조정
    // 줌 레벨이 높을수록(확대) 실제 반지름을 작게, 낮을수록(축소) 실제 반지름을 크게
    const zoomFactor = Math.pow(2, 14 - currentLevel); // 14는 기준 줌 레벨
    const calculatedRadius = (baseRadius / zoomFactor) * 4;

    // 최소 반지름 보장 (너무 작아지지 않도록)
    const minRadius = 2;
    const finalRadius = Math.max(calculatedRadius, minRadius);

    return finalRadius;
  };

  // 현재 위치 Circle 생성
  const createLocationCircle = (position: any) => {
    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) {
      console.log("카카오맵 API를 찾을 수 없습니다.");
      return;
    }

    // 기존 Circle 제거
    if (locationCircleRef.current) {
      locationCircleRef.current.setMap(null);
    }

    // 줌 레벨에 따른 반지름 계산
    const radius = getCircleRadius(8);

    // 현재 위치를 나타내는 Circle 생성
    const locationCircle = new kakao.maps.Circle({
      center: position,
      radius: radius,
      strokeWeight: 3,
      strokeColor: "#007AFF",
      strokeOpacity: 1,
      strokeStyle: "solid",
      fillColor: "#007AFF",
      fillOpacity: 0.8,
      map: mapRef.current,
    });

    locationCircleRef.current = locationCircle;
  };

  // 펄스 Circle 애니메이션 생성
  const createPulseCircle = (position: any) => {
    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) return;

    // 기존 펄스 Circle 제거
    if (pulseCircleRef.current) {
      pulseCircleRef.current.setMap(null);
    }

    // 줌 레벨에 따른 반지름 계산
    const baseRadius = getCircleRadius(20);

    // 펄스 애니메이션을 위한 Circle 생성
    const pulseCircle = new kakao.maps.Circle({
      center: position,
      radius: baseRadius,
      strokeWeight: 2,
      strokeColor: "#007AFF",
      strokeOpacity: 0.6,
      strokeStyle: "solid",
      fillColor: "#007AFF",
      fillOpacity: 0.2,
      map: mapRef.current,
    });

    pulseCircleRef.current = pulseCircle;

    // 펄스 애니메이션 효과
    let scale = 1;
    let opacity = 0.6;
    const animate = () => {
      if (!pulseCircleRef.current) return;

      scale += 0.02;
      opacity -= 0.01;

      if (scale > 3) {
        scale = 1;
        opacity = 0.6;
      }

      // 줌 레벨에 맞춰 반지름 조정
      const currentRadius = getCircleRadius(20);
      pulseCircleRef.current.setRadius(currentRadius * scale);
      pulseCircleRef.current.setOptions({
        strokeOpacity: opacity,
        fillOpacity: opacity * 0.3,
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!mapRef.current || !lat || !lng) {
      alert("현재 위치 정보가 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        const currentPos = new kakao.maps.LatLng(lat, lng);

        // 현재 위치로 지도 중심 이동
        mapRef.current.setCenter(currentPos);

        // 적절한 줌 레벨로 설정 (상세한 뷰)
        mapRef.current.setLevel(3);
      }
    } catch (error) {
      console.error("현재 위치로 이동 실패:", error);
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (locationCircleRef.current) {
        locationCircleRef.current.setMap(null);
      }
      if (pulseCircleRef.current) {
        pulseCircleRef.current.setMap(null);
      }
    };
  }, []);

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
          className={styles.myPos}
          onClick={moveToCurrentLocation}
          disabled={isLoading}
          title="현재 위치로 이동"
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
