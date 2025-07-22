import React from "react";
import styles from "./HomeHeader.module.css";
import LeftArrow from "./arrow/LeftArrow";
import RightArrow from "./arrow/RightArrow";
import DownArrow from "./arrow/DownArrow";

import PolaroidButton from "../../common/button/ButtonIcon/PolaroidButton";
import PhotoButton from "../../common/button/ButtonIcon/PhotoButton";
interface Props {
  viewType: "polaroid" | "photo";
  currentDate: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenModal: () => void;
  onSwitchView: (vt: "polaroid" | "photo") => void;
}

export default function HomeHeader({
  viewType,
  currentDate,
  onPrev,
  onNext,
  onOpenModal,
  onSwitchView,
}: Props) {
  // 텍스트 포맷:
  const parsedDate = new Date(
    viewType === "polaroid" ? currentDate : `${currentDate}-01`
  );

  const month = parsedDate.toLocaleDateString("en", { month: "short" });

  const label =
    viewType === "polaroid"
      ? `${parsedDate.getFullYear()} ${month}. ${parsedDate.getDate()}`
      : `${parsedDate.getFullYear()} ${month}`;

  return (
    <div className={styles.header}>
      <div className={styles.center}>
        <button onClick={onPrev} className={styles.nav}>
          <LeftArrow />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className={styles.frame}
        >
          <span className={styles.label}>{label}</span>
          <DownArrow />
        </button>
        <button onClick={onNext} className={styles.nav}>
          <RightArrow />
        </button>
      </div>

      <div className={styles.modeSwitch}>
        {viewType === "polaroid" ? (
          <PhotoButton onClick={() => onSwitchView("photo")} />
        ) : (
          <PolaroidButton onClick={() => onSwitchView("polaroid")} />
        )}
      </div>
    </div>
  );
}
