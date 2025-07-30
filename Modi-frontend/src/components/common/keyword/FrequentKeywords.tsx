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

const FrequentKeywords = ({ Bigmargin }: { Bigmargin: boolean }) => {
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
          <span key={index} className={styles.keyword_chip}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FrequentKeywords;
