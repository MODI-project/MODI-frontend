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
    dong?: string; // '동' 정보
  };
  character: Exclude<CharacterKey, null>;
  onClick?: (position: { lat: number; lng: number; address?: string }) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  map,
  diary,
  character,
  onClick,
}) => {
  useEffect(() => {
    if (!map) {
      return;
    }

    if (!diary.lat || !diary.lng) {
      return;
    }

    const kakao = (window as any).kakao;

    // 1) 위치 객체
    const position = new kakao.maps.LatLng(diary.lat, diary.lng);

    // 2) Marker용 DOM 컨테이너 생성
    const container = document.createElement("div");
    container.className = styles.mapMarker_container;

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
      if (diary.lat && diary.lng) {
        onClick?.({
          lat: diary.lat,
          lng: diary.lng,
          address: (diary as any).address ?? undefined,
        });
      }
    });

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
  }, [map, diary, character, onClick]);

  return null; // 실제로는 DOM 마운트 없이 useEffect로만 처리
};

export default MapMarker;
