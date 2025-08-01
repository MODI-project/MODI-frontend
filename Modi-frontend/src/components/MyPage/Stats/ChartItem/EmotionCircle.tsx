interface Props {
  label: string;
  size: number;
  value: number;
  icon: string; // SVG 경로
}

export default function EmotionCircle({ label, size, value, icon }: Props) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={icon} alt={label} style={{ width: "70%", height: "70%" }} />
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: "12px",
          textAlign: "center",
          fontFamily: "NanumSquareRound",
        }}
      >
        {label} {value}
      </div>
    </div>
  );
}
