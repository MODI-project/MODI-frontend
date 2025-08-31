import React, { useEffect, useMemo } from "react";
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
  multilineAfterSi?: boolean;
}

export default function VisitStatsBarList({
  data,
  onMaxLabelChange,
  multilineAfterSi,
}: VisitStatsBarListProps) {
  const { character } = useCharacter();
  // 아이콘 경로
  const iconPaths = useMemo(() => {
    if (!character) return { base: "", color: "" };
    const base = `/images/character-statsbar/${character}/${character}_head.svg`;
    const color = `/images/character-statsbar/${character}/${character}_head_color.svg`;
    return { base, color };
  }, [character]);

  // 최대값/최대라벨
  const max = useMemo(
    () => (data.length ? Math.max(...data.map((d) => d.value)) : 0),
    [data]
  );

  const maxLabel = useMemo(() => {
    if (!data.length || max <= 0) return undefined;
    return data.find((d) => d.value === max)?.label;
  }, [data, max]);

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
        height: max > 0 ? (d.value / max) * MAX_BAR_HEIGHT : 0,
        isMax: d.value === max,
        icon: d.value === max ? iconPaths.color : iconPaths.base,
      }));
  }, [character, data, max, iconPaths]);

  // maxLabel이 변경되면 부모에 알림
  useEffect(() => {
    if (onMaxLabelChange && maxLabel) {
      onMaxLabelChange(maxLabel);
    }
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
      {filled.map((item, idx) => (
        <StyleBar
          key={item.label || `placeholder-${idx}`}
          label={item.label}
          value={item.value}
          height={item.height}
          icon={item.icon}
          isMax={item.isMax}
          maxColor={maxBarColorMap[character]}
          character={character}
          multilineAfterSi={multilineAfterSi}
        />
      ))}
    </div>
  );
}
