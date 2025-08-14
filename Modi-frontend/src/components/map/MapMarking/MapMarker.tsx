import { useEffect, useMemo } from "react";
import styles from "./MapMarker.module.css";
import { getMapMarkerIcon } from "../../../utils/MapMarkerImages";
import type { CharacterKey } from "../../../utils/MapMarkerImages";
import type { Emotion } from "../../../data/diaries";

interface MapMarkerProps {
  map: any; // kakao.maps.Map 인스턴스
  diary: {
    id: number;
    lat?: number; // 위도 (y)
    lng?: number; // 경도 (x)
    emotion: string; // ex) "happy","sad"...
    postCount: number; // +n 에 표시될 값
  };
  character: Exclude<CharacterKey, null>;
  onClick?: (locationId: number) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  map,
  diary,
  character,
  onClick,
}) => {
  useEffect(() => {
    console.log("MapMarker useEffect 실행:", {
      map: !!map,
      diary,
      character,
    });

    if (!map) {
      console.warn("지도 객체가 없습니다.");
      return;
    }

    if (!diary.lat || !diary.lng) {
      console.warn("마커 좌표가 없습니다:", { lat: diary.lat, lng: diary.lng });
      return;
    }

    const kakao = (window as any).kakao;

    // 1) 위치 객체
    const position = new kakao.maps.LatLng(diary.lat, diary.lng);
    console.log("마커 위치 생성:", {
      lat: diary.lat,
      lng: diary.lng,
      position: position,
    });

    // 2) Marker용 DOM 컨테이너 생성
    const container = document.createElement("div");
    container.className = styles.mapMarker_container;
    console.log("마커 컨테이너 생성:", container);

    // 3) 캐릭터 이미지
    const charImg = document.createElement("img");
    const emo = diary.emotion as Emotion;
    const iconUrl = getMapMarkerIcon(character, emo);
    if (!iconUrl) {
      console.warn("Marker icon not found:", character, emo);
    }

    charImg.src = iconUrl ?? "";
    charImg.alt = `${diary.emotion} ${character}`;

    charImg.classList.add(
      styles.character_image,
      styles[`${character}_image`] // 캐릭터 별 이미지 css 적용
    );
    container.appendChild(charImg);

    // 4) 게시글 수 배지
    const badge = document.createElement("span");
    badge.classList.add(
      styles.post_counts,
      styles[`post_counts_${character}`] // 캐릭터 별 post_counts css 적용
    );
    badge.textContent = `+${diary.postCount}`;
    container.appendChild(badge);

    container.addEventListener("click", () => {
      onClick?.(diary.id);
    });

    // 5) CustomOverlay 생성
    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: container,
      yAnchor: 1, // marker 하단 기준으로 위치 맞추기
    });
    console.log("CustomOverlay 생성:", overlay);
    overlay.setMap(map);
    console.log("마커를 지도에 추가 완료");

    return () => {
      overlay.setMap(null);
    };
  }, [map, diary, character, onClick]);

  return null; // 실제로는 DOM 마운트 없이 useEffect로만 처리
};

export default MapMarker;
