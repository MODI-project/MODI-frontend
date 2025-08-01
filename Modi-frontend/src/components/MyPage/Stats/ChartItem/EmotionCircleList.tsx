import EmotionCircle from "./EmotionCircle";
import style from "./EmotionCircle.module.css";
interface EmotionItem {
  label: string;
  value: number;
  icon: string; // SVG 파일 경로 또는 import된 이미지
}

interface Props {
  data: EmotionItem[];
}

export default function EmotionCircleList({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));

  const minSize = 60;
  const maxSize = 85;

  const normalized = data.map((d) => {
    const ratio = (d.value - min) / (max - min || 1); // 0 나눔 방지
    const size = minSize + ratio * (maxSize - minSize);
    return { ...d, size };
  });

  return (
    <div className={style.container}>
      {normalized.map((item) => (
        <EmotionCircle
          key={item.label}
          label={item.label}
          size={item.size}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
