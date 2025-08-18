import { useEffect, useRef, useState } from "react";
import MapSearchBar from "../SearchPlace/MapSearchBar";
import Geolocation from "../UserPosition/Geolocation";

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
    if (!window.kakao) {
      console.error("window.kakao가 존재하지 않습니다.");
      return;
    }

    if (!mapRef.current) {
      console.error("mapRef.current가 존재하지 않습니다.");
      return;
    }

    try {
      const center = new window.kakao.maps.LatLng(latitude, longitude);
      const options = {
        center,
        level,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, options);

      setMapInstance(map);

      // 부모 컴포넌트에 지도 인스턴스 전달
      if (onMapReadyRef.current) {
        onMapReadyRef.current(map);
      }
    } catch (error) {}
  }, [latitude, longitude, level]);

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
          <MapSearchBar map={mapInstance} onPlaceSelect={onPlaceSelect} />
        </div>
      )}
      <Geolocation map={mapInstance} />
    </div>
  );
};

export default KakaoMap;
