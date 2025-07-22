import React from "react";
import { useCharacter } from "../../../../contexts/CharacterContext";
import { getEmotionIcon } from "../../../../utils/emotionImages";
import type { Emotion } from "../../../../data/diaries";

interface Props {
  emotion: Emotion;
}

export default function EmotionCharacter({ emotion }: Props) {
  const { character } = useCharacter();
  console.log("▶ EmotionCharacter:", { character, emotion });
  if (!character) return null; // 아직 선택 안 된 경우
  // 이 시점에 character 는 CharacterKey 와 동일
  const src = getEmotionIcon(character, emotion);
  console.log("▶ getEmotionIcon 반환:", src);
  if (!src) return null;
  return <img src={src} alt={emotion} />;
}
