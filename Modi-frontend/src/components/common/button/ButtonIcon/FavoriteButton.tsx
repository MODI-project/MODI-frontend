import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
  isFavorite?: boolean;
}

export default function ButtonIcon({ onClick, isFavorite }: ButtonIconProps) {
  return (
    <button className={styles.container} onClick={onClick}>
      <img
        src={isFavorite ? "/icons/favorite_on.svg" : "/icons/favorite_off.svg"}
        alt="즐겨찾기 아이콘"
        className={styles.icon}
      />
    </button>
  );
}
