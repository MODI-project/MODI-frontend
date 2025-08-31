import styles from "./ButtonIcon.module.css";

interface ButtonIconProps {
  onClick?: () => void;
  isNotification?: boolean;
}

export default function ButtonIcon({
  onClick,
  isNotification,
}: ButtonIconProps) {
  return (
    <button className={styles.container} onClick={onClick}>
      <img
        src={
          isNotification
            ? "/icons/notification_O.svg"
            : "/icons/notification_X.svg"
        }
        alt="뒤로가기 버튼"
        className={styles.icon}
      />
    </button>
  );
}
