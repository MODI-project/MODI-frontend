import React, { useState, useMemo, useEffect } from "react";
import Picker from "react-mobile-picker-scroll";
import styles from "./DateSelector.module.css";
import { CharacterType } from "../../../contexts/CharacterContext";

export interface DiaryItem {
  date: string;
}

interface Props {
  viewType: "polaroid" | "photo";
  items: DiaryItem[];
  initialDate: string;
  onChange: (date: string) => void;
  userCharacter: CharacterType;
}

const colorMap: Record<NonNullable<CharacterType>, string> = {
  momo: "#fbd7d5",
  boro: "#FEE888",
  lumi: "#A7E1B6",
  zuni: "#93D1E0",
};

const DateSelector: React.FC<Props> = ({
  viewType,
  items,
  initialDate,
  onChange,
  userCharacter,
}) => {
  const ITEM_HEIGHT = 40;
  const VISIBLE = viewType === "polaroid" ? 3 : 2;

  // 파싱
  const [year, setYear] = useState(initialDate.slice(0, 4));
  const [month, setMonth] = useState(initialDate.slice(5, 7));
  const [day, setDay] = useState(
    viewType === "polaroid" ? initialDate.slice(8, 10) : ""
  );

  // 옵션 계산
  const years = useMemo(
    () => Array.from(new Set(items.map((d) => d.date.slice(0, 4)))).sort(),
    [items]
  );
  const months = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((d) => d.date.startsWith(year))
            .map((d) => d.date.slice(5, 7))
        )
      ).sort(),
    [items, year]
  );
  const days = useMemo(
    () =>
      viewType === "polaroid"
        ? Array.from(
            new Set(
              items
                .filter((d) => d.date.startsWith(`${year}-${month}`))
                .map((d) => d.date.slice(8, 10))
            )
          ).sort()
        : [],
    [items, viewType, year, month]
  );

  useEffect(() => {
    // days 초기화
    if (viewType === "polaroid" && days.length) {
      setDay(days[0]);
    }
  }, [days, viewType]);

  // Controlled value groups
  const optionGroups = useMemo(() => {
    const base = { year: years, month: months };
    if (viewType === "polaroid") return { ...base, day: days };
    return base;
  }, [years, months, days, viewType]);

  const valueGroups = useMemo(() => {
    const base = { year, month };
    if (viewType === "polaroid") return { ...base, day };
    return base;
  }, [year, month, day, viewType]);

  const handleChange = (name: string, value: string) => {
    if (name === "year") setYear(value);
    if (name === "month") setMonth(value);
    if (name === "day") setDay(value);
  };

  // 상위 onChange
  useEffect(() => {
    const date =
      viewType === "polaroid" ? `${year}-${month}-${day}` : `${year}-${month}`;
    onChange(date);
  }, [year, month, day, viewType, onChange]);

  // style vars
  const highlight = userCharacter ? colorMap[userCharacter] : "#ccc";

  return (
    <div
      className={styles.picker}
      style={{ "--picker-highlight": highlight } as any}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <Picker
        optionGroups={optionGroups}
        valueGroups={valueGroups}
        onChange={handleChange}
        itemHeight={ITEM_HEIGHT}
        height={ITEM_HEIGHT * VISIBLE}
      />
    </div>
  );
};

export default DateSelector;
