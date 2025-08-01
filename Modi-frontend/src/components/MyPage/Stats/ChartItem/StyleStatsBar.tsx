import style from "./StyleStatsBar.module.css";

const MAX_BAR_COLOR = "#2C2C2C";

const ZUNI_MAX_HEIGHT = 70;
const ZUNI_HEAD_HEIGHT = 7;

const ZUNI_MAX_OFFSET = ZUNI_MAX_HEIGHT - ZUNI_HEAD_HEIGHT;

interface Props {
  label: string;
  value: number;
  height: number;
  icon: string;
  isMax?: boolean; // 최대값 여부
  maxColor?: string;
  maxBorderColor?: string;
  character: string;
}

export default function StyleBar({
  label,
  value,
  height,
  icon,
  isMax,
  maxColor,
  character,
}: Props) {
  const isZuni = character === "zuni";
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
                  top: `${ZUNI_MAX_OFFSET * (1 - height / ZUNI_MAX_HEIGHT)}px`,
                }}
              >
                <img
                  src={icon}
                  className={style.zuniImage}
                  alt={label}
                  style={{
                    marginBottom: `-${offset}px`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <img src={icon} alt={label} className={style.barIcon} />
            <div
              className={`${style.bar} ${isMax ? style.maxColor : ""}`}
              style={{
                height: `${height}px`,
                backgroundColor: isMax ? maxColor : "#EEEDEB",
                border: isMax
                  ? `1px solid ${MAX_BAR_COLOR}`
                  : "1px solid #9C9C9C",
              }}
            />
          </>
        )}
      </div>
      <div className={style.label}>
        {label} {value}
      </div>
    </div>
  );
}
