import styles from "./ButtonBar.module.css";

interface ButtonBarProps {
  location: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "primary" | "small";
}

export default function ButtonBar({
  location,
  label,
  onClick,
  disabled,
  size = "primary",
}: ButtonBarProps) {
  return (
    <button
      className={`${styles.button} ${styles[size]} ${styles[location]}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
}
