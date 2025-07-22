import styles from "./SearchPage.module.css";
import Header from "../../components/common/Header";

const SearchPage = () => {
  return (
    <div className={styles.SearchPage_wrapper}>
      <div className={styles.SearchPage_container}>
        <Header middle="일기 검색하기" />
        <div className={styles.main_container}>
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder="키워드를 입력해주세요"
              className={styles.search_input}
            />
            <img
              className={styles.search_icon}
              src="/icons/black_search.svg"
              alt="검색"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
