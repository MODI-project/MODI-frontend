import EmotionCircle from "./EmotionCircle";
import style from "./EmotionCircle.module.css";
interface EmotionItem {
  label?: string;
  value?: number;
  icon: string; // SVG 파일 경로 또는 import된 이미지
}

interface Props {
  data: EmotionItem[];
}

export default function EmotionCircleList({ data }: Props) {
  const realValues = data
    .filter((d) => Number.isFinite(d.value))
    .map((d) => d.value as number);
  const max = realValues.length ? Math.max(...realValues) : 1;
  const min = realValues.length ? Math.min(...realValues) : 0;

  const minSize = 60;
  const maxSize = 85;

  const normalized = data.map((d) => {
    const ratio = Number.isFinite(d.value)
      ? ((d.value as number) - min) / (max - min || 1)
      : 0;
    const size = minSize + ratio * (maxSize - minSize);
    return { ...d, size };
  });

  return (
    <div className={style.container}>
      {normalized.map((item, idx) => (
        <EmotionCircle
          key={`${item.label ?? "placeholder"}-${idx}`}
          label={item.label}
          value={item.value}
          size={item.size}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
