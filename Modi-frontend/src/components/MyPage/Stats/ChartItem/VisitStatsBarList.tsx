import React, { useEffect } from "react";
import StyleBar from "./StyleStatsBar";
import style from "./StyleStatsBar.module.css";
import { useCharacter } from "../../../../contexts/CharacterContext";

const MAX_BAR_HEIGHT = 70;

interface StyleBarListProps {
  onMaxLabelChange?: (label: string) => void;
}

export default function VisitStatsBarList({
  onMaxLabelChange,
}: StyleBarListProps) {
  const { character } = useCharacter();

  if (!character) return null;

  const iconPath = `/images/character-statsbar/${character}/${character}_head.svg`;
  const coloredIcon = `/images/character-statsbar/${character}/${character}_head_color.svg`;

  const styleData = [
    { label: "영통동", value: 15, icon: iconPath },
    { label: "경희대", value: 7, icon: iconPath },
    { label: "서천동", value: 5, icon: iconPath },
    { label: "행궁동", value: 2, icon: iconPath },
  ];
  const max = Math.max(...styleData.map((d) => d.value));
  const maxLabel = styleData.find((d) => d.value === max)?.label;

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

  const normalized = styleData
    .sort((a, b) => b.value - a.value) // 내림차순 정렬
    .map((d) => ({
      ...d,
      height: (d.value / max) * MAX_BAR_HEIGHT,
      isMax: d.value === max,
      icon: iconPath,
    }));

  return (
    <div className={style.barList}>
      {normalized.map(({ label, value, height, icon, isMax }) => (
        <StyleBar
          key={label}
          label={label}
          value={value}
          height={height}
          icon={isMax ? coloredIcon : icon}
          isMax={isMax}
          maxColor={maxBarColorMap[character]}
          character={character}
        />
      ))}
    </div>
  );
}
