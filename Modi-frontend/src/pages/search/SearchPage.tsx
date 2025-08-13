import { useState, useRef } from "react";
import styles from "./SearchPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";
import { useCharacter } from "../../contexts/CharacterContext";
import { searchDiaries } from "../../apis/Diary/searchDiary";
import { useNavigate } from "react-router-dom";

type Diary = {
  id: number;
  date: string;
  photoUrl: string | null;
  summary: string;
  emotion: string;
  tags: string[];
  created_at: string;
};

const fallbackImg =
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=800";

const SearchPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const navigate = useNavigate();

  const [grouped, setGrouped] = useState<Record<string, Diary[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { character } = useCharacter();
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색 실행 (API 호출)
  const doSearch = async (term: string) => {
    const t = term.trim();
    if (!t) return;

    try {
      setLoading(true);
      setError(null);
      const result = await searchDiaries(t);
      setGrouped(result);
      setHasSearched(true);
      setSearchStarted(true);
      setIsFocused(false);
    } catch {
      setError("검색에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setGrouped({});
      setHasSearched(false);
      setSearchStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await doSearch(query);
    inputRef.current?.blur();
  };

  const noResult =
    searchStarted &&
    query.trim().length > 0 &&
    Object.keys(grouped).length === 0;

  return (
    <div className={styles.SearchPage_wrapper}>
      <div className={styles.SearchPage_container}>
        <Header middle="기록 검색하기" />
        <div className={styles.main_container}>
          <div className={styles.search_container}>
            <input
              ref={inputRef}
              type="text"
              placeholder="키워드를 입력해주세요"
              className={styles.search_input}
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (!val.trim()) {
                  setSearchStarted(false);
                  setHasSearched(false);
                  setGrouped({});
                  setError(null);
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setQuery((e.target as HTMLInputElement).value);
              }}
              onFocus={() => {
                setIsFocused(true);
                setSearchStarted(false);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                  const val = inputRef.current?.value ?? "";
                  if (!val.trim()) {
                    setSearchStarted(false);
                    setHasSearched(false);
                    setGrouped({});
                    setError(null);
                  } else if (hasSearched) {
                    setSearchStarted(true);
                  }
                }, 100);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  if (isComposing || e.nativeEvent?.isComposing) return;
                  await handleSearch();
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

          {isFocused && (
            <FrequentKeywords
              Bigmargin={false}
              onKeywordClick={async (keyword) => {
                setQuery(keyword);
                await doSearch(keyword);
                inputRef.current?.blur();
              }}
            />
          )}

          {loading && (
            <div className={styles.result_wrapper}>
              <div className={styles.loading}>불러오는 중…</div>
            </div>
          )}
          {error && (
            <div className={styles.result_wrapper}>
              <div className={styles.error}>{error}</div>
            </div>
          )}

          {/* 결과 리스트 */}
          {searchStarted &&
            query.trim() !== "" &&
            !loading &&
            !error &&
            !noResult && (
              <div className={styles.result_wrapper}>
                {Object.entries(grouped).map(([dateLabel, items]) => (
                  <section key={dateLabel} className={styles.section}>
                    <h3 className={styles.date_heading}>{dateLabel}</h3>
                    <div className={styles.grid}>
                      {items.map((d) => (
                        <button
                          key={d.id}
                          className={styles.card}
                          onClick={() => {
                            navigate("/recorddetail", {
                              state: { diaryId: String(d.id) },
                            });
                          }}
                        >
                          <img
                            crossOrigin="anonymous"
                            src={d.photoUrl || fallbackImg}
                            alt={d.summary}
                            className={styles.card_img}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                fallbackImg;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

          {/* 결과 없음 */}
          {noResult && !loading && !error && (
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
