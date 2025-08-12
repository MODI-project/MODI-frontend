import styles from "./FrequentKeywords.module.css";

const dummyKeywords = [
  "학교",
  "축제",
  "국내여행",
  "서울",
  "서울",
  "학교",
  "축제",
  "국내여행",
  "서울",
  "서울",
];

const FrequentKeywords = ({
  Bigmargin,
  onKeywordClick,
}: {
  Bigmargin: boolean;
  onKeywordClick?: (keyword: string) => void;
}) => {
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
        {dummyKeywords.map((keyword, index) => (
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
