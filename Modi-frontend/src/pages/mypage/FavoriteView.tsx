import React, { useState, useEffect } from "react";
import { FavoriteItem, getFavorites } from "../../apis/favorites";
import FavoriteDiary from "../../components/MyPage/Favorite/FavoriteDiary";
import styles from "./MyPage.module.css";

export default function FavoriteView() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getFavorites();
        // 디버그: 들어오는 최종 URL 확인
        console.table(list.map((x) => ({ id: x.id, url: x.imageSrc })));
        setFavorites(list);
      } catch (err) {
        console.error("❌ 즐겨찾기 불러오기 실패:", err);
      }
    })();
  }, []);

  return (
    <div className={styles.photoGrid}>
      {favorites.map((d) => (
        <FavoriteDiary
          key={d.id}
          id={d.id}
          photoUrl={d.imageSrc}
          date={d.date}
          emotion={""}
          clicked={false}
        />
      ))}
    </div>
  );
}
