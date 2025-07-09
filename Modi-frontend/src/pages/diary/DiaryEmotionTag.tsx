import styles from "./DiaryEmotionTag.module.css";
import Header from "../../components/common/Header";

const DiaryEmotionTag = () => {
  return (
    <div className={styles.DiaryEmotionTag_wrapper}>
      <div className={styles.DiaryEmotionTag_container}>
        <Header />
        <div className={styles.main_container}>
          <p className={styles.ask}>오늘은 어떤 하루였나요?</p>
          DiaryEmotionTag
        </div>
      </div>
    </div>
  );
};

export default DiaryEmotionTag;
