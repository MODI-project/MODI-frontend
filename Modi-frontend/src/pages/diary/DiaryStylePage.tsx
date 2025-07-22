import styles from "./DiaryStylePage.module.css";
import Header from "../../components/common/Header";

const DiaryStylePage = () => {
  return (
    <div className={styles.DiaryStyle_wrapper}>
      <div className={styles.DiaryStyle_container}>
        <Header
          left="/icons/back.svg"
          middle="일기 기록하기"
          right="/icons/X.svg"
          write={true}
        />
        <div className={styles.main_container}></div>
      </div>
    </div>
  );
};

export default DiaryStylePage;
