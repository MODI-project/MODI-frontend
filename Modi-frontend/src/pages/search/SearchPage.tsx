import { useMemo, useState, useRef } from "react";
import styles from "./SearchPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FrequentKeywords from "../../components/common/keyword/FrequentKeywords";
import { useCharacter } from "../../contexts/CharacterContext";

// 1) 더미 데이터
type Diary = {
  id: number;
  date: string; // "2025-07-29"
  photoUrl: string | null;
  summary: string;
  emotion: string;
  tags: string[];
  created_at: string;
};

const DUMMY_DIARIES: Diary[] = [
  {
    id: 8,
    date: "2025-07-26",
    photoUrl:
      "https://images.unsplash.com/photo-1520975922296-3f734c3f7f4b?q=80&w=800",
    summary: "테스트",
    emotion: "기쁨",
    tags: ["야호", "토큰"],
    created_at: "2025-07-26T11:52:45.463216",
  },
  {
    id: 10,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
    summary: "생성1",
    emotion: "사랑",
    tags: ["야호", "와하"],
    created_at: "2025-07-29T12:06:29.956077",
  },
  {
    id: 11,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800",
    summary: "생성2",
    emotion: "사랑",
    tags: ["메롱", "어쩌고"],
    created_at: "2025-07-29T12:07:35.138932",
  },
  {
    id: 12,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=800",
    summary: "생성3",
    emotion: "기쁨",
    tags: ["커피", "어쩌고"],
    created_at: "2025-07-29T12:08:17.780477",
  },
  {
    id: 13,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1514515489015-4c2b27c1d5b9?q=80&w=800",
    summary: "생성4",
    emotion: "사랑",
    tags: ["커피", "어쩌고"],
    created_at: "2025-07-29T12:08:59.538256",
  },
  {
    id: 14,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1518112166137-85f9979a43aa?q=80&w=800",
    summary: "생성5",
    emotion: "슬픔",
    tags: ["야호", "커피"],
    created_at: "2025-07-29T12:09:34.244764",
  },
  {
    id: 15,
    date: "2025-07-29",
    photoUrl:
      "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=800",
    summary: "생성6",
    emotion: "신남",
    tags: ["산책", "커피"],
    created_at: "2025-07-29T12:11:00.072653",
  },
  {
    id: 16,
    date: "2025-07-31",
    photoUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
    summary: "생성",
    emotion: "지루함",
    tags: ["메롱", "커피"],
    created_at: "2025-07-31T18:38:52.640012",
  },
  {
    id: 17,
    date: "2025-08-31",
    photoUrl: null, // fallback 이미지로 대체됨
    summary: "id반환",
    emotion: "보통",
    tags: ["메롱", "커피"],
    created_at: "2025-07-31T18:54:40.510371",
  },
];

const fallbackImg =
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=800"; // 포토URL 없을 때

const formatDateK = (isoDate: string) => {
  const d = new Date(isoDate + "T00:00:00");
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}. ${m}. ${day}`;
};

const matchDiary = (diary: Diary, term: string) => {
  const tokens = term.trim().toLowerCase().split(/\s+/);
  const hay = [
    diary.summary,
    diary.emotion,
    ...diary.tags,
    formatDateK(diary.date),
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => hay.includes(t));
};

const SearchPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { character } = useCharacter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const doSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setQuery(t);
    setHasSearched(true);
    setSearchStarted(true);
    setIsFocused(false);
  };

  const handleSearch = () => {
    doSearch(query);
    inputRef.current?.blur();
  };

  // 2) 필터 + 3) 날짜별 그룹 (최신 날짜 먼저)
  const grouped = useMemo(() => {
    if (!searchStarted || !query.trim()) return {};
    const filtered = DUMMY_DIARIES.filter((d) => matchDiary(d, query));

    // 최신 created_at 순으로 정렬 (동일 날짜 내 카드 순서 안정화)
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // 날짜별 묶기
    return filtered.reduce<Record<string, Diary[]>>((acc, d) => {
      const key = formatDateK(d.date);
      acc[key] = acc[key] ? [...acc[key], d] : [d];
      return acc;
    }, {});
  }, [searchStarted, query]);

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
                  } else if (hasSearched) {
                    setSearchStarted(true);
                  }
                }, 100);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (isComposing || e.nativeEvent?.isComposing) return;
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

          {isFocused && (
            <FrequentKeywords
              Bigmargin={false}
              onKeywordClick={(keyword) => {
                doSearch(keyword);
                inputRef.current?.blur();
              }}
            />
          )}

          {/* 결과 리스트 */}
          {searchStarted && !noResult && (
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
                          // 상세로 이동 연결되면 여기서 라우팅
                          // navigate(`/diaries/${d.id}`)
                        }}
                      >
                        <img
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

          {/* 결과 없음 이미지 */}
          {noResult && (
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
