import React from "react";
import styles from "./PhotoDiary.module.css";

export interface PhotoDiaryProps {
    id: number;
    photoUrl: string;
    date: string;
    emotion: string;
    clicked: boolean;
}

const PhotoDiary: React.FC<PhotoDiaryProps> = ({ photoUrl, ...rest }) => (
  <div className={styles.card}>
    {photoUrl ? (
      <img src={photoUrl} className={styles.thumb} alt="" />
    ) : (
      <div className={styles.thumb} />
    )}
  </div>
);

export default PhotoDiary;

