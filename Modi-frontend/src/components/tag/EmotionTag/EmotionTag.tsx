import styles from "./EmotionTag.module.css";

interface EmotionTagProps {
  label: string;
  type: "momo" | "boro" | "lumi" | "zuni";
}

export default function EmotionTag({ label, type }: EmotionTagProps) {
  return (
    <div className={styles.tag}>
      <div className={`${styles["inner-border"]} ${styles[type]}`}>
        <span className={styles.label}>{"#" + label}</span>
      </div>
    </div>
  );
}
