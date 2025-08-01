import { useEffect, useMemo } from "react";
import styles from "./MapMarker.module.css";

interface MapMarkerProps {
  map: any; // kakao.maps.Map 인스턴스
  diary: {
    id: number;
    lat: number; // 위도 (y)
    lng: number; // 경도 (x)
    emotion: string; // ex) "happy","sad"...
    postCount: number; // +n 에 표시될 값
  };
  character: "momo" | "boro" | "lumi" | "zuni";
}

const MapMarker: React.FC<MapMarkerProps> = ({ map, diary, character }) => {
  useEffect(() => {
    if (!map) return;
    const kakao = (window as any).kakao;

    // 1) 위치 객체
    const position = new kakao.maps.LatLng(diary.lat, diary.lng);

    // 2) Marker용 DOM 컨테이너 생성
    const container = document.createElement("div");
    container.className = styles.mapMarker_container;

    // 3) 캐릭터 이미지
    const charImg = document.createElement("img");

    charImg.src = `/images/map-marker/${character}-marker/${diary.emotion}-${character}-marker.svg`;
    charImg.alt = `${diary.emotion} ${character}`;
    container.appendChild(charImg);
    charImg.classList.add(
      styles.character_image,
      styles[`${character}_image`] // 캐릭터 별 이미지 css 적용
    );

    // 4) 게시글 수 배지
    const badge = document.createElement("span");
    badge.classList.add(
      styles.post_counts,
      styles[`post_counts_${character}`] // 캐릭터 별 post_counts css 적용
    );
    badge.textContent = `+${diary.postCount}`;
    container.appendChild(badge);

    // 5) CustomOverlay 생성
    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: container,
      yAnchor: 1, // marker 하단 기준으로 위치 맞추기
    });
    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
    };
  }, [map, diary, character]);

  return null; // 실제로는 DOM 마운트 없이 useEffect로만 처리
};

export default MapMarker;
