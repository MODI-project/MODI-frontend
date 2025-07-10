import React, { useState, useMemo } from "react";

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

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {/* 연도 */}
      <select value={year} onChange={(e) => handleYear(e.target.value)}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      {/* 월 */}
      <select value={month} onChange={(e) => handleMonth(e.target.value)}>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>

      {/* 하루 단위 모드일 때만 일 */}
      {viewType === "polaroid" && (
        <select value={day} onChange={(e) => handleDay(e.target.value)}>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default DateSelector;
