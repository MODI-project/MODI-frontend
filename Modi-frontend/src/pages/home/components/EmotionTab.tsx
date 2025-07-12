import React, { useState } from "react";
import EmotionChip from "../../../components/tag/EmotionChip/EmotionChip";
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
  /* 필터링할 감정 리스트 */
  emotions?: readonly Emotion[];
  /* 현재 선택된 감정 (null이면 전체) */
  selectedEmotion: Emotion | null;
  /* 감정 클릭 시 호출 */
  onSelectEmotion: (e: Emotion | null) => void;
  /* 유저가 고른 캐릭터 타입으로 칩 색상을 결정 */
  userCharacter: CharacterType;
}

export default function EmotionTab({
  emotions = DEFAULT_EMOTIONS,
  selectedEmotion,
  onSelectEmotion,
  userCharacter,
}: EmotionTabProps) {
  return (
    <div className={styles.wrapper}>
      {emotions.map((emotion) => (
        <EmotionChip
          key={emotion}
          label={emotion}
          type={userCharacter}
          selected={selectedEmotion === emotion}
          onClick={() => onSelectEmotion(emotion)}
        />
      ))}
    </div>
  );
}
