import { useEffect, useRef, useState } from "react";
import MapSearchBar from "./MapSearchBar";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  level?: number;
  showSearchBar?: boolean;
  onPlaceSelect?: (place: any) => void;
  onMapReady?: (map: any) => void;
}

const KakaoMap = ({
  latitude,
  longitude,
  level = 3,
  showSearchBar = true,
  onPlaceSelect,
  onMapReady,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const onMapReadyRef = useRef(onMapReady);

  // onMapReady 함수를 ref에 저장하여 최신 값을 유지
  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  useEffect(() => {
    console.log("KakaoMap useEffect 실행");
    console.log(
      "window.kakao 확인:",
      typeof window.kakao !== "undefined" ? "존재함" : "존재하지 않음"
    );
    console.log(
      "mapRef.current 확인:",
      mapRef.current ? "존재함" : "존재하지 않음"
    );
    console.log(
      "mapRef.current 스타일:",
      mapRef.current
        ? {
            width: mapRef.current.style.width,
            height: mapRef.current.style.height,
            display: mapRef.current.style.display,
            visibility: mapRef.current.style.visibility,
          }
        : "null"
    );

    if (!window.kakao) {
      console.error("window.kakao가 존재하지 않습니다.");
      return;
    }

    if (!mapRef.current) {
      console.error("mapRef.current가 존재하지 않습니다.");
      return;
    }

    try {
      console.log("지도 생성 시작...");
      console.log("위도:", latitude, "경도:", longitude, "레벨:", level);

      const center = new window.kakao.maps.LatLng(latitude, longitude);
      const options = {
        center,
        level,
      };

      console.log("지도 옵션:", options);

      const map = new window.kakao.maps.Map(mapRef.current, options);
      console.log("지도 생성 완료:", map);

      setMapInstance(map);

      // 부모 컴포넌트에 지도 인스턴스 전달
      if (onMapReadyRef.current) {
        console.log("onMapReady 콜백 호출");
        onMapReadyRef.current(map);
      }
    } catch (error) {
      console.error("지도 생성 중 오류 발생:", error);
    }
  }, [latitude, longitude, level]); // onMapReady 제거

  const handlePlaceSelect = (place: any) => {
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }

    // 선택된 장소로 지도 중심 이동
    if (mapInstance && place.x && place.y) {
      const newCenter = new window.kakao.maps.LatLng(
        parseFloat(place.y),
        parseFloat(place.x)
      );
      mapInstance.setCenter(newCenter);
      mapInstance.setLevel(2); // 확대 레벨 조정
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        id="map"
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",

          minHeight: "400px", // 최소 높이 보장
        }}
      />
      {showSearchBar && mapInstance && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <MapSearchBar map={mapInstance} onPlaceSelect={handlePlaceSelect} />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
