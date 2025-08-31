import React, { useState, useEffect } from "react";
import styles from "./FavoriteDiary.module.css";

export interface FavoriteDiaryProps {
  id: number;
  photoUrl: string;
  date: string;
  emotion: string;
  clicked: boolean;
  onClick?: () => void;
}

const FavoriteDiary: React.FC<FavoriteDiaryProps> = ({ photoUrl, onClick }) => {
  const [src, setSrc] = useState<string | null>(photoUrl || null);
  useEffect(() => setSrc(photoUrl || null), [photoUrl]);
  return (
    <div className={styles.card} onClick={onClick}>
      {src ? (
        <img
          src={src}
          className={styles.thumb}
          alt="일기 썸네일"
          referrerPolicy="no-referrer" // iStock 같은 곳 핫링크 차단 완화
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
