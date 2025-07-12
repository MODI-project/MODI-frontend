import styles from "./EmotionChip.module.css";

interface EmotionChipProps {
  label: string;
  type: "momo" | "boro" | "lumi" | "zuni";
  selected: boolean;
  onClick?: () => void;
}

export default function EmotionChip({
  label,
  type,
  selected,
  onClick,
}: EmotionChipProps) {
  return (
    <div
      className={`${styles.chip} ${styles[type]} ${
        selected ? styles.selected : styles.unselected
      }`}
      onClick={onClick}
    >
      <span className={styles.label}>{label}</span>
    </div>
  );
}
