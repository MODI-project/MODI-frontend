import styles from "./Popup.module.css";

interface PopupProps {
  title: string;
  description?: string;
  imageUrl?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  buttons: {
    label: string;
    onClick: () => void;
  }[];
}

const Popup = ({
  title,
  description,
  onClose,
  imageUrl,
  showCloseButton = false,
  buttons,
}: PopupProps) => {
  return (
    <div className={styles.popup_overlay}>
      <div className={styles.popup_box}>
        {/* X 버튼 */}
        {showCloseButton && (
          <div className={styles.close_button_wrapper} onClick={onClose}>
            <img className={styles.close_button} src="/icons/X.svg" />
          </div>
        )}

        {/* 이미지 (옵션) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="popup image"
            className={styles.popup_image}
          />
        )}

        {/* 타이틀 */}
        <p className={styles.popup_title}>{title}</p>

        {/* 설명 (옵션) */}
        {description && (
          <p className={styles.popup_description}>{description}</p>
        )}

        {/* 버튼 */}
        <div className={styles.popup_buttons}>
          {buttons.slice(0, 2).map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={styles.popup_button}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
