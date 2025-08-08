import React from "react";
import styles from "./PhotoDiary.module.css";

export interface PhotoDiaryProps {
  id: number;
  photoUrl: string;
  date: string;
  emotion: string;
  clicked: boolean;
  onClick?: () => void;
}

const PhotoDiary: React.FC<PhotoDiaryProps> = ({
  photoUrl /* , ...rest */,
  onClick,
}) => (
  <div className={styles.card} onClick={onClick}>
    {photoUrl ? (
      <img src={photoUrl} className={styles.thumb} alt="일기 썸네일" />
    ) : (
      <div className={styles.thumb} />
    )}
  </div>
);

export default PhotoDiary;
