import React, { useState, useMemo, useEffect, useRef } from "react";
import WheelPicker from "react-wheelpicker";
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

const colorMap: Record<Exclude<CharacterType, null>, string> = {
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
  const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE;
  const pad = Math.floor(VISIBLE / 2);

  // 파싱
  const [year, setYear] = useState(initialDate.slice(0, 4));
  const [month, setMonth] = useState(initialDate.slice(5, 7));
  const [day, setDay] = useState(
    viewType === "polaroid" ? initialDate.slice(8, 10) : ""
  );

  console.log("[DS] render", { initialDate, year, month, day });

  const prevYMRef = useRef({ year, month });

  useEffect(() => {
    console.log("[DS] initialDate effect", { initialDate, viewType });
    const parts = initialDate.split("-");
    setYear(parts[0]);
    setMonth(parts[1] ?? month);
    if (viewType === "polaroid" && parts[2]) {
      setDay(parts[2]);
    }
  }, [initialDate, viewType]);

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
    console.log("[DS] days recalculated", { year, month, days });
    if (viewType !== "polaroid") return;
    if (days.length === 0) return;
    const changedYM =
      prevYMRef.current.year !== year || prevYMRef.current.month !== month;
    if (changedYM) {
      // 기존 day가 새 days에 없으면 첫째 날로 보정
      setDay((prev) => (prev && days.includes(prev) ? prev : days[0]));
      prevYMRef.current = { year, month };
    }
  }, [days, year, month, viewType]);

  useEffect(() => {
    if (viewType === "polaroid") {
      if (!day || day.length !== 2) return;
    }
    const date =
      viewType === "polaroid" ? `${year}-${month}-${day}` : `${year}-${month}`;
    console.log("[DS] emit onChange", date);
    onChange(date);
  }, [year, month, day, viewType, onChange]);

  const highlight =
    userCharacter !== null && userCharacter in colorMap
      ? colorMap[userCharacter]
      : "#ccc";

  // 4) 화면에 표시할 문자열 배열
  const yearOpts = years.map((y) => `${y}년`);
  const monthOpts = months.map((m) => `${Number(m)}월`);
  const dayOpts = days.map((d) => `${Number(d)}일`);
  return (
    <div
      className={styles.picker}
      style={{ "--picker-highlight": highlight } as any}
    >
      <div className={styles.selectionOverlay} />
      <div className={styles.columnWrapper}>
        <WheelPicker
          key="year"
          scrollerId="year-picker"
          data={yearOpts}
          animation="wheel"
          height={PICKER_HEIGHT}
          parentHeight={PICKER_HEIGHT}
          fontSize={14}
          defaultSelection={years.indexOf(year)}
          updateSelection={(idx: number) => {
            console.log("[DS] year updateSelection", {
              idx,
              value: years[idx],
            });
            setYear(years[idx]);
          }}
        />

        {/* Month Picker */}
        <WheelPicker
          key={`month-${year}`}
          scrollerId="month-picker"
          data={monthOpts}
          animation="wheel"
          height={PICKER_HEIGHT}
          parentHeight={PICKER_HEIGHT}
          fontSize={14}
          defaultSelection={months.indexOf(month)}
          updateSelection={(idx: number) => {
            console.log("[DS] month updateSelection", {
              idx,
              value: months[idx],
            });
            setMonth(months[idx].padStart(2, "0"));
          }}
        />

        {/* Day Picker (폴라로이드 모드) */}
        {viewType === "polaroid" && (
          <WheelPicker
            key={`day-${year}-${month}`}
            scrollerId="day-picker"
            data={dayOpts}
            animation="wheel"
            height={PICKER_HEIGHT}
            parentHeight={PICKER_HEIGHT}
            fontSize={14}
            defaultSelection={days.indexOf(day)}
            updateSelection={(idx: number) => {
              console.log("[DS] day updateSelection", {
                idx,
                value: days[idx],
              });
              setDay(days[idx].padStart(2, "0"));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DateSelector;
