import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./DateSelector.module.css";

export interface DiaryItem {
  date: string;
}

interface Props {
  viewType: "polaroid" | "photo";
  items: DiaryItem[]; //모든 일기들의 날짜 데이터
  initialDate: string; //처음에 선택되어 있어야 할 날짜
  onChange: (date: string) => void;
}

const DateSelector: React.FC<Props> = ({
  viewType,
  items,
  initialDate,
  onChange,
}) => {
  const [year, setYear] = useState(initialDate.slice(0, 4));
  const [month, setMonth] = useState(initialDate.slice(5, 7));
  const [day, setDay] = useState(
    viewType === "polaroid" ? initialDate.slice(8, 10) : ""
  );

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => i.date.slice(0, 4)))).sort(),
    [items]
  );

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

  const handleYear = (y: string) => {
    setYear(y);
    const newDate =
      viewType === "polaroid" ? `${y}-${month}-${day}` : `${y}-${month}`;
    onChange(newDate);
  };
  const handleMonth = (m: string) => {
    setMonth(m);
    const newDate =
      viewType === "polaroid" ? `${year}-${m}-${day}` : `${year}-${m}`;
    onChange(newDate);
  };
  const handleDay = (d: string) => {
    setDay(d);
    onChange(`${year}-${month}-${d}`);
  };

  const yearCol = useRef<HTMLDivElement>(null);
  const monthCol = useRef<HTMLDivElement>(null);
  const dayCol = useRef<HTMLDivElement>(null);

  const centerOffset = 140 / 2;

  const onScroll = (
    el: HTMLDivElement,
    options: string[],
    setter: (v: string) => void
  ) => {
    const { scrollTop, clientHeight } = el;
    // 옵션 높이가 모두 동일하다고 가정 (예: 40px)
    const itemHeight = 40;
    // 중앙 y좌표 = scrollTop + clientHeight/2
    const centerY = scrollTop + clientHeight / 2;
    // 인덱스 계산
    const idx = Math.round(centerY / itemHeight) - 1;
    const clamped = Math.min(Math.max(idx, 0), options.length - 1);
    const value = options[clamped];
    setter(value);
  };

  useEffect(() => {
    const yC = yearCol.current,
      mC = monthCol.current,
      dC = dayCol.current;
    if (yC) yC.addEventListener("scroll", () => onScroll(yC, years, setYear));
    if (mC) mC.addEventListener("scroll", () => onScroll(mC, months, setMonth));
    if (viewType === "polaroid" && dC)
      dC.addEventListener("scroll", () => onScroll(dC, days, setDay));
    // cleanup omitted for brevity
  }, [years, months, days]);

  // state가 바뀔 때 마다 onChange 호출
  useEffect(() => {
    if (viewType === "polaroid") onChange(`${year}-${month}-${day}`);
    else onChange(`${year}-${month}`);
  }, [year, month, day]);

  return (
    <div className={styles.picker}>
      <div className={styles.column} ref={yearCol}>
        {years.map((y) => (
          <div
            key={y}
            className={`${styles.option} ${y === year ? styles.selected : ""}`}
          >
            {y}년
          </div>
        ))}
      </div>
      <div className={styles.column} ref={monthCol}>
        {months.map((m) => (
          <div
            key={m}
            className={`${styles.option} ${m === month ? styles.selected : ""}`}
          >
            {m}월
          </div>
        ))}
      </div>
      {viewType === "polaroid" && (
        <div className={styles.column} ref={dayCol}>
          {days.map((d) => (
            <div
              key={d}
              className={`${styles.option} ${d === day ? styles.selected : ""}`}
            >
              {d}일
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
