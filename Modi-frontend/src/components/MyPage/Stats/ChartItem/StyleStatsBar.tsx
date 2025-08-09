import style from "./StyleStatsBar.module.css";

const MAX_BAR_COLOR = "#2C2C2C";

const ZUNI_MAX_HEIGHT = 70;
const ZUNI_HEAD_HEIGHT = 7;

const ZUNI_MAX_OFFSET = ZUNI_MAX_HEIGHT - ZUNI_HEAD_HEIGHT;

interface Props {
  label?: string;
  value?: number;
  height?: number;
  icon: string;
  isMax?: boolean; // 최대값 여부
  maxColor?: string;
  maxBorderColor?: string;
  character: string;
}

export default function StyleBar({
  label,
  value,
  height = 0,
  icon,
  isMax,
  maxColor,
  character,
}: Props) {
  const hasValue = typeof value === "number";
  const isZuni = character === "zuni";
  const clampedH = Math.max(0, Math.min(height, ZUNI_MAX_HEIGHT));
  const offset = ZUNI_MAX_HEIGHT - height;
  return (
    <div className={style.barItem}>
      <div className={style.iconAndBar}>
        {isZuni ? (
          <div className={style.barContainer}>
            <div className={style.zuniCropWrapper}>
              <div
                className={style.zuniWrapper}
                style={{
                  top: `${
                    ZUNI_MAX_OFFSET * (1 - clampedH / ZUNI_MAX_HEIGHT)
                  }px`,
                }}
              >
                <img
                  src={icon}
                  className={style.zuniImage}
                  alt={label || ""}
                  style={{
                    marginBottom: `-${offset}px`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <img src={icon} alt={label || ""} className={style.barIcon} />
            {hasValue ? (
              <div
                className={`${style.bar} ${isMax ? style.maxColor : ""}`}
                style={{
                  height: `${clampedH}px`,
                  backgroundColor: isMax ? maxColor : "#EEEDEB",
                  border: isMax
                    ? `1px solid ${MAX_BAR_COLOR}`
                    : "1px solid #9C9C9C",
                }}
              />
            ) : (
              <div
                className={style.bar}
                style={{ height: 0, border: "none", background: "transparent" }}
              />
            )}
          </>
        )}
      </div>
      <div
        className={style.label}
        style={{
          visibility: hasValue && label ? "visible" : "hidden",
          height: 18,
          lineHeight: "18px",
        }}
      >
        {label} {hasValue ? value : ""}
      </div>
    </div>
  );
}
