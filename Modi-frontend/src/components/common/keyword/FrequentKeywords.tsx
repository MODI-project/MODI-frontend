import { useEffect, useState } from "react";
import styles from "./FrequentKeywords.module.css";
import { getPopularTags } from "../../../apis/Diary/tags";

const FrequentKeywords = ({
  Bigmargin,
  onKeywordClick,
}: {
  Bigmargin: boolean;
  onKeywordClick?: (keyword: string) => void;
}) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getPopularTags();
        if (!active) return;
        setKeywords(list);
      } catch (e) {
        console.warn("[FrequentKeywords] 인기 태그 조회 실패", e);
        if (!active) return;
        setKeywords([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <p
        className={`${styles.title} ${
          Bigmargin ? styles.margin_big : styles.margin_small
        }`}
      >
        자주 사용하는 키워드
      </p>

      <div className={styles.keyword_container}>
        {loading && <span className={styles.skeleton}>불러오는 중…</span>}

        {!loading && keywords.length === 0 && (
          <span className={styles.empty}>아직 인기 키워드가 없어요</span>
        )}

        {!loading &&
          keywords.map((keyword, index) => (
            <button
              key={`${keyword}-${index}`}
              type="button"
              className={styles.keyword_chip}
              onMouseDown={(e) => {
                e.preventDefault();
                onKeywordClick?.(keyword);
              }}
            >
              {keyword}
            </button>
          ))}
      </div>
    </div>
  );
};

export default FrequentKeywords;
