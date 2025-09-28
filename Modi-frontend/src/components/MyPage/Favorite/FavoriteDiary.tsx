import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FavoriteDiary.module.css";

export interface FavoriteDiaryProps {
  id: number;
  photoUrl: string;
  date: string;
  emotion: string;
  clicked: boolean;
  onClick?: () => void;
}

const FavoriteDiary: React.FC<FavoriteDiaryProps> = ({
  id,
  photoUrl,
  onClick,
}) => {
  const [src, setSrc] = useState<string | null>(photoUrl || null);
  const navigate = useNavigate();

  useEffect(() => setSrc(photoUrl || null), [photoUrl]);

  const goDetail = () => {
    navigate("/recorddetail", { state: { diaryId: id } });
  };
  return (
    <div
      className={styles.card}
      onClick={onClick ?? goDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? (onClick ?? goDetail)() : null)}
    >
      {src ? (
        <img
          src={src}
          className={styles.thumb}
          alt="일기 썸네일"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className={styles.thumb} />
      )}
    </div>
  );
};

export default FavoriteDiary;
