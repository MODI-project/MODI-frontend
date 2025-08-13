import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
  isFavorite?: boolean;
}

export default function ButtonIcon({
  onClick,
  isFavorite = false,
}: ButtonIconProps) {
  return (
    <button className={styles.container} onClick={onClick}>
      <img
        src={isFavorite ? "/icons/favorite_on.svg" : "/icons/favorite_off.svg"}
        alt={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        className={styles.icon}
      />
    </button>
  );
}
