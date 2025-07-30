import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./DateSelector.module.css";
import {
  CharacterType,
  useCharacter,
} from "../../../contexts/CharacterContext";

export interface DiaryItem {
  date: string;
}

interface Props {
  viewType: "polaroid" | "photo";
  items: DiaryItem[]; //모든 일기들의 날짜 데이터
  initialDate: string; //처음에 선택되어 있어야 할 날짜
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
  const ITEM_HEIGHT = 40; // 옵션 하나 높이
  const DEFAULT_VISIBLE =
    viewType === "polaroid" // 폴라로이드면 3줄, 아니면 2줄
      ? 3
      : 2;
  const [year, setYear] = useState(initialDate.slice(0, 4));
  const [month, setMonth] = useState(initialDate.slice(5, 7));
  const [day, setDay] = useState(
    viewType === "polaroid" ? initialDate.slice(8, 10) : ""
  );

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => i.date.slice(0, 4)))).sort(),
    [items]
  );

  const hasMounted = useRef(false);

  const months = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((i) => i.date.startsWith(year))
            .map((i) => i.date.slice(5, 7))
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
                .filter((i) => i.date.startsWith(`${year}-${month}`))
                .map((i) => i.date.slice(8, 10))
            )
          ).sort()
        : [],
    [items, viewType, year, month]
  );

  const getVisibleCount = (len: number) =>
    Math.max(1, Math.min(DEFAULT_VISIBLE, len - 1));
  const yearCount = getVisibleCount(years.length);
  const monthCount = getVisibleCount(months.length);
  const dayCount = viewType === "polaroid" ? getVisibleCount(days.length) : 0;

  const yearHeight = yearCount * ITEM_HEIGHT;
  const monthHeight = monthCount * ITEM_HEIGHT;
  const dayHeight = dayCount * ITEM_HEIGHT;

  const yearCol = useRef<HTMLDivElement>(null);
  const monthCol = useRef<HTMLDivElement>(null);
  const dayCol = useRef<HTMLDivElement>(null);

  const VISIBLE_COUNT = viewType === "polaroid" ? 3 : 2;
  const VISIBLE_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

  const handleScroll =
    (options: string[], setter: (v: string) => void) =>
    (e: React.UIEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const el = e.currentTarget;
      const centerY = Math.floor(
        (el.scrollTop + VISIBLE_HEIGHT / 2) / ITEM_HEIGHT
      );
      const idx = Math.floor(centerY / ITEM_HEIGHT);
      const clamped = Math.max(Math.min(idx, 0), options.length - 1);
      setter(options[clamped]);
    };

  const handleWheel =
    (
      options: string[],
      setter: (v: string) => void,
      ref: React.RefObject<HTMLDivElement | null>
    ) =>
    (e: React.WheelEvent<HTMLDivElement>) => {
      console.log("💥 wheel!", options, "deltaY:", e.deltaY);

      e.stopPropagation();

      const el = ref.current;
      if (!el) return;

      console.log("clientHeight:", el.clientHeight);
      console.log("scrollHeight:", el.scrollHeight);
      console.log("canScroll?", el.scrollHeight > el.clientHeight);

      // 1) 컨테이너 자체를 스크롤
      const delta = Math.sign(e.deltaY) * ITEM_HEIGHT;
      el.scrollBy({ top: delta, behavior: "auto" });

      // 2) 중앙 기준으로 선택도 업데이트
      const centerY = el.scrollTop + VISIBLE_HEIGHT / 2;
      const idx = Math.floor(centerY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, options.length - 1));
      setter(options[clamped]);
    };

  // year 초기 스크롤 위치
  useEffect(() => {
    if (yearCol.current) {
      yearCol.current.scrollTop = years.indexOf(year) * ITEM_HEIGHT;
    }
  }, [year, years]);

  // month 초기 스크롤 위치
  useEffect(() => {
    if (monthCol.current) {
      monthCol.current.scrollTop = months.indexOf(month) * ITEM_HEIGHT;
    }
  }, [month, months]);

  // day 초기 스크롤 위치 (폴라로이드일 때만)
  useEffect(() => {
    if (viewType === "polaroid" && dayCol.current) {
      dayCol.current.scrollTop = days.indexOf(day) * ITEM_HEIGHT;
    }
  }, [day, days]);

  // state가 바뀔 때 마다 onChange 호출
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (viewType === "polaroid") onChange(`${year}-${month}-${day}`);
    else onChange(`${year}-${month}`);
  }, [year, month, day]);

  const highlight = userCharacter ? colorMap[userCharacter] : "#ccc";

  const styleVars = {
    "--picker-highlight": highlight,
  } as React.CSSProperties;

  return (
    <div className={styles.picker} style={styleVars}>
      <div className={styles.selectionOverlay} />
      <div className={styles.columnWrapper}>
        <div
          className={styles.column}
          ref={yearCol}
          onWheel={handleWheel(years, setYear, yearCol)}
          onScroll={handleScroll(years, setYear)}
          style={{ height: yearHeight }}
        >
          {years.map((y) => (
            <div
              key={y}
              className={`${styles.option} ${
                y === year ? styles.selected : ""
              }`}
            >
              {y}년
            </div>
          ))}
        </div>
        <div
          className={styles.column}
          ref={monthCol}
          onWheel={handleWheel(months, setMonth, monthCol)}
          onScroll={handleScroll(months, setMonth)}
          style={{ height: monthHeight }}
        >
          {months.map((m) => (
            <div
              key={m}
              className={`${styles.option} ${
                m === month ? styles.selected : ""
              }`}
            >
              {m}월
            </div>
          ))}
        </div>
        {viewType === "polaroid" && (
          <div
            className={styles.column}
            ref={dayCol}
            onWheel={handleWheel(days, setDay, dayCol)}
            onScroll={handleScroll(days, setDay)}
            style={{ height: dayHeight }}
          >
            {days.map((d) => (
              <div
                key={d}
                className={`${styles.option} ${
                  d === day ? styles.selected : ""
                }`}
              >
                {d}일
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSelector;
