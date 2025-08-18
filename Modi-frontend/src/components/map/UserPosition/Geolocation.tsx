import React, { useState, useEffect, useRef } from "react";
import styles from "./Geolocation.module.css";
import { reverseToDong } from "../../../apis/MapAPIS/reverseGeocode";

const EARTH_R = 6371000; // meters

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_R * c; // meters
}

/**
 * Returns meters per 1 pixel at the given LatLng using Kakao projection.
 */
function metersPerPixelAt(mapInstance: any, lat: number, lng: number): number {
  if (!mapInstance) return 1;
  const proj = mapInstance.getProjection?.();
  if (!proj) return 1;

  const centerPoint = proj.containerPointFromCoords(
    new (window as any).kakao.maps.LatLng(lat, lng)
  );
  const rightPoint = new (window as any).kakao.maps.Point(
    centerPoint.x + 1,
    centerPoint.y
  ); // +1px
  const rightCoord = proj.coordsFromContainerPoint(rightPoint);

  return haversine(lat, lng, rightCoord.getLat(), rightCoord.getLng());
}

/**
 * Returns a circle radius in meters that will render as `px` pixels on screen
 * at the current zoom level around `center`.
 */
function radiusMetersForPixels(
  mapInstance: any,
  center: any,
  px: number
): number {
  const mpp = metersPerPixelAt(mapInstance, center.getLat(), center.getLng());
  return mpp * px;
}

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
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const pulseCircleRef = useRef<any>(null);
  const locationCircleRef = useRef<any>(null);

  // map prop이 변경될 때마다 참조 업데이트
  useEffect(() => {
    mapRef.current = map;

    // 지도 줌 레벨 변경 이벤트 리스너 추가
    if (map) {
      const handleZoomChanged = () => {
        if (isTracking) {
          const kakao = (window as any).kakao;
          if (!kakao || !kakao.maps) return;

          const center = currentPosition
            ? new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)
            : map.getCenter?.();

          if (!center) return;

          if (locationCircleRef.current) {
            const r = getCircleRadius(12, center);
            locationCircleRef.current.setOptions({ center, radius: r });
          }
          if (pulseCircleRef.current) {
            // base 24px; scale는 애니메이션 루프에서 유지
            const base = getCircleRadius(24, center);
            // 현재 투명도/스케일 상태는 유지하고 반지름만 즉시 맞춤
            pulseCircleRef.current.setOptions({ center });
            pulseCircleRef.current.setRadius(base);
          }
        }
      };

      // 줌 변경 이벤트 리스너 등록
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        kakao.maps.event.addListener(map, "zoom_changed", handleZoomChanged);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
          kakao.maps.event.removeListener(
            map,
            "zoom_changed",
            handleZoomChanged
          );
        };
      }
    }
  }, [map, currentPosition, isTracking]);

  // 권한 거부 상태를 localStorage에 저장하여 반복 시도 방지
  useEffect(() => {
    const denied = localStorage.getItem("geolocation_permission");
    if (denied === "denied") {
      setPermissionDenied(true);
    }
  }, []);

  // 위치 추적 시작/중지 토글
  const toggleLocationTracking = () => {
    if (!mapRef.current) {
      alert("지도가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 이미 추적 중이면 중지
    if (isTracking) {
      stopTracking();
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

    // 브라우저의 Geolocation API 사용 (watchPosition으로 실시간 추적)
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        // 성공 콜백
        (position) => {
          const { latitude, longitude } = position.coords;

          // 카카오맵 좌표로 변환
          const kakao = (window as any).kakao;
          if (kakao && kakao.maps) {
            const currentPos = new kakao.maps.LatLng(latitude, longitude);

            // 지도 중심을 현재 위치로 이동
            mapRef.current.setCenter(currentPos);

            // 현재 위치 Circle 생성
            createLocationCircle(currentPos);

            // 펄스 Circle 애니메이션 생성
            createPulseCircle(currentPos);

            // 카카오맵 애니메이션 API를 사용한 부드러운 지도 이동
            mapRef.current.panTo(currentPos);

            setCurrentPosition({ lat: latitude, lng: longitude });
            setIsLoading(false);
            setIsTracking(true);
            // 현재 위치 동으로 환산해서 console로 표시
            reverseToDong(latitude, longitude)
              .then((res) => {
                if (res) {
                  console.log(
                    `현위치 : ${res.fullAddress ? ` ${res.fullAddress}` : ""}`
                  );
                } else {
                  console.log("동 정보를 찾지 못했습니다.");
                }
              })
              .catch((e) => console.error("[역지오코딩] 실패:", e));
          } else {
            console.log("카카오맵 API를 찾을 수 없습니다.");
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
          setIsTracking(false);
          let errorMessage = "위치 정보를 가져오는데 실패했습니다.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근이 거부되었습니다.";
              setPermissionDenied(true);
              localStorage.setItem("geolocation_permission", "denied");
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
          maximumAge: 10000, // 10초 이내의 캐시된 위치 정보 사용 (실시간 추적이므로 더 짧게)
          timeout: 27000, // 27초 타임아웃
        }
      );
    } else {
      setIsLoading(false);
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  // 원하는 화면 픽셀 크기(px)를 실제 지구 반지름(m)으로 환산
  // 예: 12px로 항상 동일하게 보이게 렌더
  const getCircleRadius = (desiredPixelRadius: number, centerLatLng?: any) => {
    const center =
      centerLatLng ?? (mapRef.current ? mapRef.current.getCenter?.() : null);
    if (!center) return desiredPixelRadius; // fallback

    const meters = radiusMetersForPixels(
      mapRef.current,
      center,
      desiredPixelRadius
    );
    return Math.max(meters, 1); // 최소 1m 보장
  };

  // 현재 위치 Circle 생성
  const createLocationCircle = (position: any) => {
    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) {
      console.log("카카오맵 API를 찾을 수 없습니다.");
      return;
    }

    // 화면 픽셀 기준 12px로 고정 보이도록 환산
    const radius = getCircleRadius(12, position);

    if (locationCircleRef.current) {
      locationCircleRef.current.setOptions({ center: position, radius });
      locationCircleRef.current.setMap(mapRef.current);
      return;
    }

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

    // 재사용: 기존 객체가 있으면 center만 업데이트하고 애니메이션은 동일 루프에서 반영
    if (!pulseCircleRef.current) {
      pulseCircleRef.current = new kakao.maps.Circle({
        center: position,
        radius: getCircleRadius(24, position), // 약 24px로 보이도록 시작
        strokeWeight: 2,
        strokeColor: "#007AFF",
        strokeOpacity: 0.6,
        strokeStyle: "solid",
        fillColor: "#007AFF",
        fillOpacity: 0.2,
        map: mapRef.current,
      });
    } else {
      pulseCircleRef.current.setOptions({ center: position });
      pulseCircleRef.current.setMap(mapRef.current);
    }

    let scale = 1;
    let opacity = 0.6;
    const animate = () => {
      if (!pulseCircleRef.current) return;

      // 현재 줌에서 24px에 해당하는 실제 미터 단위 반지름
      const baseMeters = getCircleRadius(24, position);

      scale += 0.02;
      opacity -= 0.01;
      if (scale > 3) {
        scale = 1;
        opacity = 0.6;
      }

      pulseCircleRef.current.setRadius(baseMeters * scale);
      pulseCircleRef.current.setOptions({
        strokeOpacity: opacity,
        fillOpacity: opacity * 0.3,
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // 실시간 위치 추적 중지
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsTracking(false);
      console.log("위치 추적이 중지됨");
    }

    // Circle들도 중지
    if (locationCircleRef.current) {
      locationCircleRef.current.setMap(null);
      locationCircleRef.current = null;
    }
    if (pulseCircleRef.current) {
      pulseCircleRef.current.setMap(null);
      pulseCircleRef.current = null;
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
    toggleLocationTracking();
  };

  // 컴포넌트 언마운트 시 추적 중지 및 정리
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
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
          className={`${styles.myPos} ${isLoading ? styles.loading : ""} ${
            isTracking ? styles.tracking : ""
          }`}
          onClick={toggleLocationTracking}
          disabled={isLoading}
          title={isTracking ? "위치 추적 중지" : "현재 위치로 이동"}
        >
          {isLoading ? (
            <span className={styles.loading_text}>
              {isTracking ? "추적 중지 중..." : "위치 확인 중..."}
            </span>
          ) : isTracking ? (
            <></>
          ) : (
            <></>
          )}
        </button>
      )}
    </div>
  );
};

export default Geolocation;
