import { useState } from "react";
import styles from "./SearchPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";
import { useCharacter } from "../../contexts/CharacterContext"; // ✅ 캐릭터 context

const SearchPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false); // ✅ 검색 여부
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { character } = useCharacter();

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchStarted(true);
    setHasSearched(true);
    setIsFocused(false);
  };

  return (
    <div className={styles.SearchPage_wrapper}>
      <div className={styles.SearchPage_container}>
        <Header middle="기록 검색하기" />
        <div className={styles.main_container}>
          <div className={styles.search_container}>
            <input
              type="text"
              placeholder="키워드를 입력해주세요"
              className={styles.search_input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setSearchStarted(false);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                  if (hasSearched) {
                    setSearchStarted(true);
                  }
                }, 100);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <img
              className={styles.search_icon}
              src="/icons/black_search.svg"
              alt="검색"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            />
          </div>

          {/* 입력창 포커스 시에만 추천 키워드 */}
          {isFocused && (
            <FrequentKeywords
              Bigmargin={false}
              onKeywordClick={(keyword) => {
                setQuery(keyword);
                setHasSearched(true);
                setSearchStarted(true);
                setIsFocused(false);
              }}
            />
          )}

          {/* 검색 시작되었고 결과 없을 때 이미지 */}
          {searchStarted && (
            <div className={styles.no_result}>
              <img
                src={`/images/no-search/${character ?? "momo"}.svg`}
                alt="검색 결과 없음"
                className={styles.no_result_image}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SearchPage;
