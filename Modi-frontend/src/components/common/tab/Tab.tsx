import React from "react";
import styles from "./Tab.module.css";

interface TabProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

export default function Tab({ label, selected, onClick }: TabProps) {
  console.log(
    label,
    "selected:",
    selected,
    "→ class:",
    selected ? styles.selected : styles.unselected
  );
  return (
    <div className={styles.container}>
      <span
        className={`${styles.label} ${
          selected ? styles.selected : styles.unselected
        }`}
        onClick={onClick}
      >
        {label}
      </span>
    </div>
  );
}
