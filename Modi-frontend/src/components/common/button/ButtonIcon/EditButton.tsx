import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
}

export default function ButtonIcon({ onClick }: ButtonIconProps) {
  return (
    <button className={styles.edit_container} onClick={onClick}>
      <img
        src="/icons/edit.svg"
        alt="수정하기 아이콘"
        className={styles.edit_icon}
      />
    </button>
  );
}
