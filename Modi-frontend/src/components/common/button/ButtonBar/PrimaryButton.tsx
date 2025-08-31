import React from "react";
import styles from "./ButtonBar.module.css";

interface ButtonBarProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean; // 캐릭터 선택 여부 등으로 사용
  size?: "primary" | "small";
  location?: string; // 스타일 위치 지정
  buttonRef?: React.Ref<HTMLButtonElement>; // ref 전달
}

export default function ButtonBar({
  label,
  onClick,
  disabled,
  selected = true,
  size = "primary",
  location = "",
  buttonRef,
}: ButtonBarProps) {
  const isDisabled = disabled ?? !selected;

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`
        ${styles.button}
        ${styles[size]}
        ${styles[location] || ""}
        ${selected ? styles.enabled : styles.completeBtn_disabled}
      `}
      disabled={isDisabled}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
}
