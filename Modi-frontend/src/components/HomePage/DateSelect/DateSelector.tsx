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

  useEffect(() => {
    if (viewType === "polaroid" && days.length > 0) {
      setDay(days[0]);
    }
  }, [days, viewType]);

  const getVisibleCount = (len: number) =>
    Math.max(1, Math.min(DEFAULT_VISIBLE, len - 1));

  const yearCol = useRef<HTMLDivElement>(null);
  const monthCol = useRef<HTMLDivElement>(null);
  const dayCol = useRef<HTMLDivElement>(null);

  const VISIBLE_COUNT = viewType === "polaroid" ? 3 : 2;
  const VISIBLE_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

  const scrollTimeout = useRef<number | null>(null);

  const handleScroll =
    (options: string[], setter: (v: string) => void) =>
    (e: React.UIEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const el = e.currentTarget;
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current);
      }

      // 100ms 뒤에야 옵션을 계산해서 setter 호출
      scrollTimeout.current = window.setTimeout(() => {
        const { scrollTop, clientHeight } = el;
        const centerY = scrollTop + clientHeight / 2;
        const idx = Math.floor(centerY / ITEM_HEIGHT);
        const clamped = Math.min(Math.max(idx, 0), options.length - 1);
        setter(options[clamped]);
      }, 300);
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

  const yearPadCount = getVisibleCount(years.length);
  const monthPadCount = getVisibleCount(months.length);
  const dayPadCount =
    viewType === "polaroid" ? getVisibleCount(days.length) : 0;

  // year 초기 스크롤 위치
  useEffect(() => {
    if (yearCol.current) {
      yearCol.current.scrollTop =
        (yearPadCount + years.indexOf(year)) * ITEM_HEIGHT;
    }
  }, [year, years]);

  // month 초기 스크롤 위치
  useEffect(() => {
    if (monthCol.current) {
      monthCol.current.scrollTop =
        (monthPadCount + months.indexOf(month)) * ITEM_HEIGHT;
    }
  }, [month, months]);

  // day 초기 스크롤 위치 (폴라로이드일 때만)
  useEffect(() => {
    if (viewType === "polaroid" && dayCol.current && days.length > 0) {
      const firstPaddedIdx = dayPadCount;
      dayCol.current.scrollTop = firstPaddedIdx * ITEM_HEIGHT;
      setDay(days[0]);
    }
  }, [days, dayPadCount, viewType]);

  const yearHeight = yearPadCount * ITEM_HEIGHT;
  const monthHeight = monthPadCount * ITEM_HEIGHT;
  const dayHeight = dayPadCount * ITEM_HEIGHT;

  const paddedYears = [
    ...Array(yearPadCount).fill(""),
    ...years,
    ...Array(yearPadCount).fill(""),
  ];
  const paddedMonths = [
    ...Array(monthPadCount).fill(""), // 앞에 빈칸
    ...months,
    ...Array(monthPadCount).fill(""), // 뒤에도 빈칸
  ];

  const paddedDays =
    viewType === "polaroid"
      ? [
          ...Array(dayPadCount).fill(""),
          ...days,
          ...Array(dayPadCount).fill(""),
        ]
      : [];

  return (
    <div className={styles.picker} style={styleVars}>
      <div className={styles.columnWrapper}>
        <div className={styles.selectionOverlay} />
        <div
          className={styles.column}
          ref={yearCol}
          onWheel={handleWheel(paddedYears, setYear, yearCol)}
          onScroll={handleScroll(paddedYears, setYear)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ height: yearHeight }}
        >
          {paddedYears.map((y, idx) => (
            <div
              key={`year-${idx}`}
              className={`${styles.option} ${
                y === year ? styles.selected : ""
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              {y && `${y}년`}
            </div>
          ))}
        </div>
        <div
          className={styles.column}
          ref={monthCol}
          onWheel={handleWheel(paddedMonths, setMonth, monthCol)}
          onScroll={handleScroll(paddedMonths, setMonth)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ height: monthHeight }}
        >
          {paddedMonths.map((m, idx) => (
            <div
              key={`month-${idx}`} /* idx를 써서 유니크 key */
              className={`${styles.option} ${
                m === month ? styles.selected : ""
              }`}
              style={{ height: ITEM_HEIGHT }} /* 일정한 높이 보장 */
            >
              {m ? `${m}월` : ""}
            </div>
          ))}
        </div>
        {viewType === "polaroid" && (
          <div
            className={styles.column}
            ref={dayCol}
            onWheel={handleWheel(paddedDays, setDay, dayCol)}
            onScroll={handleScroll(paddedDays, setDay)}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ height: dayHeight }}
          >
            {paddedDays.map((d, idx) => (
              <div
                key={`day-${idx}`}
                className={`${styles.option} ${
                  d === day ? styles.selected : ""
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                {d && `${d}일`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSelector;
