import React from "react";
import { allDiaries, Diary } from "../../data/diaries";
import FavoriteDiary from "../../components/MyPage/Favorite/FavoriteDiary";
import styles from "./MyPage.module.css";

export default function FavoriteView() {
  const favorites: Diary[] = allDiaries;
  return (
    <div className={styles.photoGrid}>
      {favorites.map((d) => (
        <FavoriteDiary key={d.id} {...d} clicked={false} />
      ))}
    </div>
  );
}
