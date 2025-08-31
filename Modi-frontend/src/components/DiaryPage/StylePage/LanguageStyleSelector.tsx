import { useRef, useEffect } from "react";
import style from "./LanguageStyleSelector.module.css";

interface LanguageStyleSelectorProps {
  emotion: string;
  content: string;
  isPreviewed: boolean;
  isSelected: boolean;
  onPreviewClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const LanguageStyleSelector = ({
  emotion,
  content,
  isPreviewed,
  isSelected,
  onPreviewClick,
  loading = false,
  disabled = false,
}: LanguageStyleSelectorProps) => {
  const isBtnDisabled = loading || disabled;

  const clickLockRef = useRef(false);

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isBtnDisabled || clickLockRef.current) return;
    clickLockRef.current = true;
    onPreviewClick();
  };

  useEffect(() => {
    if (!loading) clickLockRef.current = false;
  }, [loading]);

  return (
    <div
      className={`${style.LanguageStyleSelector_container} ${
        isSelected ? style.clicked : ""
      }`}
    >
      <div
        className={`${style.topRow} ${
          !isPreviewed ? style.rowLayout : style.columnLayout
        }`}
      >
        <p className={style.emotion}>{emotion}</p>
        {!isPreviewed && (
          <button
            type="button"
            className={style.previewButton}
            onClick={handlePreview}
            disabled={isBtnDisabled}
            aria-busy={loading}
          >
            {loading ? "불러오는 중" : "미리보기"}
          </button>
        )}
      </div>
      {isPreviewed && <p className={style.content}>{content}</p>}
    </div>
  );
};

export default LanguageStyleSelector;
