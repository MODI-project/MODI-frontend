import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
}

export default function ButtonIcon({ onClick }: ButtonIconProps) {
  return (
    <button className={styles.container} onClick={onClick}>
      <img src="/icons/back.svg" alt="뒤로가기 버튼" className={styles.icon} />
    </button>
  );
}
