import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./StatsDateSelect.module.css";
import DatePickerBottomSheet from "../../common/DatePickerBottomSheet";
import downArrowIcon from "../../../assets/arrow_icons/down_arrow.svg";
import DateSelector, {
  DiaryItem,
} from "../../../components/HomePage/DateSelect/DateSelector";
import { useCharacter } from "../../../contexts/CharacterContext";
import ButtonBar from "../../common/button/ButtonBar/PrimaryButton";

interface Props {
  months: string[];
  initialMonth: string;
  onMonthChange: (ym: string) => void;
}

export default function StatsDateSelect({
  months,
  initialMonth,
  onMonthChange,
}: Props) {
  const ITEM_HEIGHT = 40;
  const [open, setOpen] = useState(false);
  const year = initialMonth.slice(0, 4);
  const monthNum = parseInt(initialMonth.slice(5), 10) - 1;
  const MONTH_NAMES = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May.",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const label = MONTH_NAMES[monthNum];
  const [viewDate, setViewDate] = useState(initialMonth);
  const [selYear, setSelYear] = useState(initialMonth.slice(0, 4));
  const [selMonth, setSelMonth] = useState(initialMonth.slice(5, 7));
  const { character } = useCharacter();

  const years = useMemo(
    () => Array.from(new Set(months.map((m) => m.slice(0, 4)))).sort(),
    [months]
  );

  const monthsOfYear = useMemo(
    () =>
      months
        .filter((m) => m.startsWith(selYear + "-"))
        .map((m) => m.slice(5, 7)),
    [months, selYear]
  );

  const yearRef = useRef<HTMLDivElement>(null);
  const monRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idxY = years.indexOf(selYear);
    if (yearRef.current) yearRef.current.scrollTop = idxY * 40;
    const idxM = monthsOfYear.indexOf(selMonth);
    if (monRef.current) monRef.current.scrollTop = idxM * 40;
  }, [years, monthsOfYear, selYear, selMonth]);

  const onScroll = (
    e: React.UIEvent<HTMLDivElement>,
    options: string[],
    setter: (v: string) => void
  ) => {
    const idx = Math.round(e.currentTarget.scrollTop / 40);
    const val = options[Math.min(Math.max(idx, 0), options.length - 1)];
    setter(val);
  };

  return (
    <>
      <div className={styles.header}>
        {/* 년·월 + 토글 */}
        <div className={styles.title} onClick={() => setOpen((o) => !o)}>
          {year}&nbsp;{label}
          <img src={downArrowIcon} alt="▼" className={styles.downArrow} />
        </div>
      </div>
      <div className={styles.wrapper}>
        <DatePickerBottomSheet
          isOpen={open}
          onClose={() => setOpen(false)}
          minimizeOnDrag={false}
        >
          <div className={styles.modalInner}>
            <h3 className={styles.modalTitle}>다른 월간 일기 보기</h3>

            <DateSelector
              viewType="photo"
              items={months.map((m) => ({ date: m }))}
              initialDate={viewDate}
              onChange={(newDate) => {
                setViewDate(newDate);
              }}
              userCharacter={character!}
            />
          </div>
          <div className={styles.footerWrapper}>
            <ButtonBar
              location="modal"
              label="확인"
              onClick={() => {
                onMonthChange(viewDate);
                setOpen(false);
              }}
              size="primary"
              disabled={false}
            />
          </div>
        </DatePickerBottomSheet>
      </div>
    </>
  );
}
