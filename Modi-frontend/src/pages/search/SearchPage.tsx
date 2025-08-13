import { useState, useRef } from "react";
import styles from "./SearchPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";
import { useCharacter } from "../../contexts/CharacterContext";
import { searchDiaries } from "../../apis/Diary/searchDiary";
import { useNavigate } from "react-router-dom";

type DiaryCard = {
  id: number;
  photoUrl: string;
};

const FALLBACK_IMG = "/images/fallbacks/diary-thumb-fallback.png";

// 안전한 이미지 로딩 컴포넌트
function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMG);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== FALLBACK_IMG) {
          setImgSrc(FALLBACK_IMG);
        }
      }}
    />
  );
}

function normalizeSearchResult(anyData: any): Record<string, DiaryCard[]> {
  if (!anyData || typeof anyData !== "object") return {};

  // 1) 이미 날짜 키 객체로 온 경우
  const keys = Object.keys(anyData);
  if (keys.length && Array.isArray(anyData[keys[0]])) {
    const byDate: Record<string, DiaryCard[]> = {};
    for (const dateKey of keys) {
      const arr = anyData[dateKey];
      byDate[dateKey] = arr
        .map((item: any) => {
          if ("diaryId" in item) {
            return {
              id: item.diaryId,
              photoUrl: item.imageUrls?.[0] || FALLBACK_IMG,
            };
          }
          if ("id" in item) {
            return {
              id: item.id,
              photoUrl: item.photoUrl || item.thumbnailUrl || FALLBACK_IMG,
            };
          }
          return null;
        })
        .filter(Boolean) as DiaryCard[];
    }
    return byDate;
  }

  // 2) 배열 케이스
  const list = Array.isArray(anyData) ? anyData : [];
  const byDate: Record<string, DiaryCard[]> = {};
  for (const group of list) {
    const dateKey = group?.date ?? "기타";
    const cards: DiaryCard[] = (group?.diaries ?? [])
      .map((d: any) => ({
        id: d?.diaryId,
        photoUrl:
          d?.photoUrl || d?.thumbnailUrl || d?.imageUrls?.[0] || FALLBACK_IMG,
      }))
      .filter((c: DiaryCard) => typeof c.id === "number" && !!c.photoUrl);
    if (cards.length) byDate[dateKey] = cards;
  }
  return byDate;
}

const SearchPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [grouped, setGrouped] = useState<Record<string, DiaryCard[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { character } = useCharacter();
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = async (term: string) => {
    const t = term.trim();
    if (!t) return;

    try {
      setLoading(true);
      setError(null);

      const raw = await searchDiaries(t);
      console.log("[Search] raw response:", raw);
      const normalized = normalizeSearchResult(raw);
      console.log("[Search] normalized:", normalized);

      setGrouped(normalized);
      setHasSearched(true);
      setSearchStarted(true);
      setIsFocused(false);
    } catch (e) {
      console.error("[Search] request failed:", e);
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
              onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  if (
                    isComposing ||
                    (e.nativeEvent instanceof CompositionEvent &&
                      e.nativeEvent.isComposing)
                  )
                    return;
                  await handleSearch();
                }
              }}
            />
            <img
              className={styles.search_icon}
              src="/icons/search.svg"
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
                          <SafeImage
                            src={d.photoUrl}
                            alt="일기 미리보기"
                            className={styles.card_img}
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

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
