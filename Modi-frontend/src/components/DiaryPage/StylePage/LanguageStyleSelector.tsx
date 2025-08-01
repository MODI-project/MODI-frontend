import style from "./LanguageStyleSelector.module.css";

interface LanguageStyleSelectorProps {
  emotion: string;
  content: string;
  isPreviewed: boolean;
  isSelected: boolean;
  onPreviewClick: () => void;
}

const LanguageStyleSelector = ({
  emotion,
  content,
  isPreviewed,
  isSelected,
  onPreviewClick,
}: LanguageStyleSelectorProps) => {
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
            className={style.previewButton}
            onClick={(e) => {
              e.stopPropagation();
              onPreviewClick();
            }}
          >
            미리보기
          </button>
        )}
      </div>
      {isPreviewed && <p className={style.content}>{content}</p>}
    </div>
  );
};

export default LanguageStyleSelector;
