import React, { useState, useEffect } from "react";
import { FavoriteItem, getFavorites } from "../../apis/favorites";
import FavoriteDiary from "../../components/MyPage/Favorite/FavoriteDiary";
import styles from "./MyPage.module.css";

export default function FavoriteView() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavorites();
        setFavorites(res.data); // API 응답 데이터 저장
      } catch (err) {
        console.error("❌ 즐겨찾기 불러오기 실패:", err);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className={styles.photoGrid}>
      {favorites.map((d) => (
        <FavoriteDiary
          key={d.id}
          id={d.id}
          photoUrl={d.thumbnailUrl}
          date={d.date}
          emotion={""}
          clicked={false}
        />
      ))}
    </div>
  );
}
