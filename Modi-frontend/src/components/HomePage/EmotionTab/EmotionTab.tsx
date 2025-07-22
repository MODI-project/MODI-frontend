import React, { useState, useEffect, useRef } from "react";
import EmotionChip from "../../tag/EmotionChip/EmotionChip";
import styles from "./EmotionTab.module.css";

type CharacterType = "momo" | "boro" | "lumi" | "zuni";

const DEFAULT_EMOTIONS = [
  "기쁨",
  "놀람",
  "보통",
  "떨림",
  "사랑",
  "신남",
  "아픔",
  "슬픔",
  "지루함",
  "화남",
] as const;
export type Emotion = (typeof DEFAULT_EMOTIONS)[number];

interface EmotionTabProps {
  /* 현재 선택된 감정 (null이면 전체) */
  selectedEmotion: Emotion | null;
  /* 감정 클릭 시 호출 */
  onSelectEmotion: (e: Emotion | null) => void;
  /* 유저가 고른 캐릭터 타입으로 칩 색상을 결정 */
  userCharacter: CharacterType;
}

export default function EmotionTab({
  selectedEmotion,
  onSelectEmotion,
  userCharacter,
}: EmotionTabProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1; // 1배속 스크롤
      wrapper.scrollLeft = scrollLeft - walk;
    };

    wrapper.addEventListener("mousedown", onMouseDown);
    wrapper.addEventListener("mouseleave", onMouseLeave);
    wrapper.addEventListener("mouseup", onMouseUp);
    wrapper.addEventListener("mousemove", onMouseMove);

    return () => {
      wrapper.removeEventListener("mousedown", onMouseDown);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      wrapper.removeEventListener("mouseup", onMouseUp);
      wrapper.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {DEFAULT_EMOTIONS.map((emotion) => (
        <EmotionChip
          key={emotion}
          label={emotion}
          type={userCharacter}
          selected={selectedEmotion === emotion}
          onClick={() =>
            onSelectEmotion(selectedEmotion === emotion ? null : emotion)
          }
        />
      ))}
    </div>
  );
}
