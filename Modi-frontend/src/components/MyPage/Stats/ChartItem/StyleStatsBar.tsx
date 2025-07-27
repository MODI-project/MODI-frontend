import style from "./StyleStatsBar.module.css";

const MAX_BAR_COLOR = "#2C2C2C";

interface Props {
  label: string;
  value: number;
  height: number;
  icon: string;
  isMax?: boolean; // 최대값 여부
  maxColor?: string;
  maxBorderColor?: string;
}

export default function StyleBar({
  label,
  value,
  height,
  icon,
  isMax,
  maxColor,
}: Props) {
  return (
    <div className={style.barItem}>
      <div className={style.iconAndBar}>
        <img src={icon} alt={label} className={style.barIcon} />
        <div
          className={`${style.bar} ${isMax ? style.maxColor : ""}`}
          style={{
            height: `${height}px`,
            backgroundColor: isMax ? maxColor : "#EEEDEB",
            border: isMax ? `1px solid ${MAX_BAR_COLOR}` : "1px solid #9C9C9C",
          }}
        />
      </div>
      <div className={style.label}>
        {label} {value}
      </div>
    </div>
  );
}
