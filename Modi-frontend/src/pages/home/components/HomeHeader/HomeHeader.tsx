import React from "react";
import styles from "./HomeHeader.module.css";

import { ReactComponent as LeftArrow } from "../../../public/icons/left_arrow.svg";
import { ReactComponent as RightArrow } from "../../../public/icons/right_arrow.svg";
import { ReactComponent as DownArrow } from "../../../public/icons/down_arrow.svg";

import PolaroidButton from "../../../../components/common/button/ButtonIcon/PolaroidButton";
import PhotoButton from "../../../../components/common/button/ButtonIcon/PhotoButton";
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
  const label =
    viewType === "polaroid"
      ? new Date(currentDate).toLocaleDateString("en", {
          month: "short",
          day: "2-digit",
        })
      : new Date(currentDate + "-01").toLocaleDateString("en", {
          month: "short",
          year: "numeric",
        });

  return (
    <div className={styles.header}>
      <div className={styles.center}>
        <button onClick={onPrev} className={styles.nav}>
          <LeftArrow />
        </button>
        <button onClick={onOpenModal} className={styles.frame}>
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
