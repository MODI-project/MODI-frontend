import React from "react";
import styles from "./FavoriteDiary.module.css";

export interface FavoriteDiaryProps {
  id: number;
  photoUrl: string;
  date: string;
  emotion: string;
  clicked: boolean;
}

const FavoriteDiary: React.FC<FavoriteDiaryProps> = ({
  photoUrl /* , ...rest */,
}) => (
  <div className={styles.card}>
    {photoUrl ? (
      <img src={photoUrl} className={styles.thumb} alt="" />
    ) : (
      <div className={styles.thumb} />
    )}
  </div>
);

export default FavoriteDiary;
