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

  const padCount = Math.floor(VISIBLE / 2);
  const paddedDays = useMemo(() => {
    const pad = Array(padCount).fill(null); // null로 패딩
    return [...pad, ...days, ...pad];
  }, [days, padCount]);

  const displayOptionGroups = useMemo(() => {
    const base = {
      year: years.map((y) => `${y}년`),
      month: months.map((m) => `${Number(m)}월`),
      ...(viewType === "polaroid" && {
        day: paddedDays.map((d) => (d ? `${Number(d)}일` : "")),
      }),
    };
    if (viewType === "polaroid") {
      return { ...base, day: days.map((d) => (d ? `${Number(d)}일` : "")) };
    }
    return base;
  }, [years, months, days, viewType]);

  // 현재 선택된 값도 표시용으로 “2025년” 등
  const displayValueGroups = useMemo(() => {
    const base = {
      year: `${year}년`,
      month: `${Number(month)}월`,
    };
    if (viewType === "polaroid") {
      return { ...base, day: `${Number(day)}일` };
    }
    return base;
  }, [year, month, day, viewType]);

  // 사용자가 스크롤로 선택하면, “숫자”만 떼서 state에 저장
  const handleChange = (name: string, displayVal: string) => {
    // 숫자만 남기고, 연(year)은 4자리, 월/일은 2자리로 패딩
    if (!displayVal || displayVal === "") return;

    const raw = displayVal
      .replace(/\D/g, "")
      .padStart(name === "year" ? 4 : 2, "0");
    if (name === "year") setYear(raw);
    if (name === "month") setMonth(raw);
    if (name === "day") setDay(raw);
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
    >
      <div className={styles.selectionOverlay} />
      <div className={styles.option}>
        <Picker
          optionGroups={displayOptionGroups}
          valueGroups={displayValueGroups}
          onChange={handleChange}
          itemHeight={ITEM_HEIGHT}
          height={ITEM_HEIGHT * VISIBLE}
        />
      </div>
    </div>
  );
};

export default DateSelector;
