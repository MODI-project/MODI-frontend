import { useEffect, useRef } from "react";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  level?: number;
}

const KakaoMap = ({ latitude, longitude, level = 3 }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    const center = new window.kakao.maps.LatLng(latitude, longitude);
    const options = {
      center,
      level,
    };

    new window.kakao.maps.Map(mapRef.current, options);
  }, [latitude, longitude, level]);

  return (
    <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default KakaoMap;
