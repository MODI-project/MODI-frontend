import React, { useEffect, useMemo } from "react";
import StyleBar from "./StyleStatsBar";
import style from "./StyleStatsBar.module.css";
import { useCharacter } from "../../../../contexts/CharacterContext";

const MAX_BAR_HEIGHT = 70;
const MAX_ITEMS = 4;

const toneTextMap: Record<string, string> = {
  happy: "기쁨",
  surprised: "놀람",
  normal: "보통",
  nervous: "떨림",
  love: "사랑",
  excited: "신남",
  sick: "아픔",
  sad: "슬픔",
  bored: "지루함",
  angry: "화남",
  calm: "차분함",
};
const toKo = (label: string) => toneTextMap[label] ?? label;

interface StyleDataItem {
  label: string;
  value: number;
  icon?: string;
}

interface StyleBarListProps {
  data: StyleDataItem[];
  onMaxLabelChange?: (label: string) => void;
}

export default function StyleBarList({
  data,
  onMaxLabelChange,
}: StyleBarListProps) {
  const { character } = useCharacter();

  const max = Math.max(...data.map((d) => d.value));
  const maxLabel = useMemo(() => {
    if (!data.length || max <= 0) return undefined;
    return data.find((d) => d.value === max)?.label;
  }, [data, max]);

  const iconPaths = useMemo(() => {
    const base = character
      ? `/images/character-statsbar/${character}/${character}_head.svg`
      : "";
    const color = character
      ? `/images/character-statsbar/${character}/${character}_head_color.svg`
      : "";
    return { base, color };
  }, [character]);

  const realTop = useMemo(() => {
    if (!character || !data.length)
      return [] as Array<{
        label: string;
        value?: number;
        height: number;
        isMax: boolean;
        icon: string;
      }>;
    return [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_ITEMS)
      .map((d) => ({
        ...d,
        label: toKo(d.label),
        height: max > 0 ? (d.value / max) * MAX_BAR_HEIGHT : 0,
        isMax: d.value === max,
        icon: d.value === max ? iconPaths.color : iconPaths.base,
      }));
  }, [character, data, max, iconPaths]);

  useEffect(() => {
    if (onMaxLabelChange && maxLabel) onMaxLabelChange(maxLabel);
  }, [onMaxLabelChange, maxLabel]);

  if (!character) return null;

  const maxBarColorMap: Record<string, string> = {
    momo: "#FBD7D5",
    boro: "#FEE888",
    lumi: "#A7E1B6",
    zuni: "#93D1E0",
  };

  const filled = [...realTop];
  while (filled.length < MAX_ITEMS) {
    filled.push({
      label: "",
      value: undefined,
      height: 0,
      isMax: false,
      icon: iconPaths.base,
    });
  }

  return (
    <div className={style.barList}>
      {realTop.map((item, idx) => (
        <StyleBar
          key={item.label || `placeholder-${idx}`}
          label={item.label}
          value={item.value}
          height={item.height}
          icon={item.icon}
          isMax={item.isMax}
          maxColor={maxBarColorMap[character]}
          character={character}
        />
      ))}
    </div>
  );
}
