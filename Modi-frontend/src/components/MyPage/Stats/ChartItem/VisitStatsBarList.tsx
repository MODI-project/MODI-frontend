import React, { useEffect } from "react";
import StyleBar from "./StyleStatsBar";
import style from "./StyleStatsBar.module.css";
import { useCharacter } from "../../../../contexts/CharacterContext";

const MAX_BAR_HEIGHT = 70;
const MAX_ITEMS = 4;

interface StyleDataItem {
  label: string;
  value: number;
  icon?: string;
}

interface VisitStatsBarListProps {
  data: StyleDataItem[];
  onMaxLabelChange?: (label: string) => void;
}

export default function VisitStatsBarList({
  data,
  onMaxLabelChange,
}: VisitStatsBarListProps) {
  const { character } = useCharacter();
  if (!character || data.length === 0) return null;

  const iconPath = `/images/character-statsbar/${character}/${character}_head.svg`;
  const coloredIcon = `/images/character-statsbar/${character}/${character}_head_color.svg`;

  const max = Math.max(...data.map((d) => d.value));
  const maxLabel = data.find((d) => d.value === max)?.label;

  // maxLabel이 변경되면 부모에 알림
  useEffect(() => {
    if (onMaxLabelChange && maxLabel) {
      onMaxLabelChange(maxLabel);
    }
  }, [onMaxLabelChange, maxLabel]);

  const maxBarColorMap: Record<string, string> = {
    momo: "#FBD7D5",
    boro: "#FEE888",
    lumi: "#A7E1B6",
    zuni: "#93D1E0",
  };

  const normalized = [...data]
    .sort((a, b) => b.value - a.value) // 내림차순 정렬
    .map((d) => ({
      ...d,
      height: (d.value / max) * MAX_BAR_HEIGHT,
      isMax: d.value === max,
      icon: iconPath,
    }));

  if (data.length === 0) {
    // 전부 placeholder (아이콘만)
    return (
      <div className={style.barList}>
        {Array.from({ length: MAX_ITEMS }).map((_, i) => (
          <StyleBar
            key={`placeholder-${i}`}
            label=""
            value={undefined}
            height={0}
            icon={iconPath}
            isMax={false}
            character={character}
          />
        ))}
      </div>
    );
  }

  // 실제 데이터 정렬 → 상한 N개로 자르기
  const realTop = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_ITEMS)
    .map((d) => ({
      ...d,
      height: (d.value / (max || 1)) * MAX_BAR_HEIGHT,
      isMax: d.value === max,
      icon: d.value === max ? coloredIcon : iconPath,
    }));

  // 부모에 최대 라벨 전달(실제 데이터가 있을 때만)
  useEffect(() => {
    if (onMaxLabelChange && realTop.length > 0) {
      onMaxLabelChange(realTop[0].label);
    }
  }, [onMaxLabelChange, realTop]);

  // 부족하면 placeholder로 채우기(아이콘만)
  while (realTop.length < MAX_ITEMS) {
    realTop.push({
      label: "",
      value: undefined as any,
      height: 0,
      isMax: false,
      icon: iconPath,
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
          multilineAfterSi
        />
      ))}
    </div>
  );
}
