import React, { useState, useEffect, useRef } from "react";
import styles from "./MapSearchBar.module.css";

// 타입 정의
interface Place {
  place_name: string;
  road_address_name?: string;
  address_name: string;
  phone: string;
  x: string;
  y: string;
}

interface Pagination {
  current: number;
  last: number;
  gotoPage: (page: number) => void;
}

interface MapSearchBarProps {
  map?: any;
  onPlaceSelect?: (place: Place) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ map, onPlaceSelect }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const markersRef = useRef<any[]>([]);
  const infowindowRef = useRef<any>(null);
  const psRef = useRef<any>(null);

  // API 초기화
  const initializeApi = () => {
    console.log("MapSearchBar API 초기화 시작");

    if (!map) {
      console.log("map prop이 없습니다.");
      return false;
    }

    // map 객체를 통해 kakao API에 접근
    const kakao = (window as any).kakao;

    console.log(
      "kakao 확인:",
      typeof kakao !== "undefined" ? "존재함" : "존재하지 않음"
    );
    console.log("kakao.maps 확인:", kakao?.maps ? "존재함" : "존재하지 않음");
    console.log(
      "kakao.maps.services 확인:",
      kakao?.maps?.services ? "존재함" : "존재하지 않음"
    );

    if (typeof kakao !== "undefined" && kakao.maps && kakao.maps.services) {
      try {
        // 장소 검색 객체 생성
        psRef.current = new kakao.maps.services.Places();

        // 인포윈도우 생성
        infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });

        console.log("Kakao Maps API initialized successfully");
        setIsInitialized(true);
        return true;
      } catch (error) {
        console.error("Failed to initialize Kakao Maps API:", error);
        setIsInitialized(false);
        return false;
      }
    } else {
      console.log("Kakao Maps API not available");
      setIsInitialized(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("MapSearchBar useEffect 실행");
    console.log("map prop 확인:", map ? "존재함" : "존재하지 않음");

    // map prop이 있을 때만 초기화 시도
    if (map) {
      console.log("map prop 존재, API 초기화 시도");

      // 약간의 지연을 두고 초기화 시도 (카카오맵 API가 완전히 로드될 시간을 줌)
      const timer = setTimeout(() => {
        const initSuccess = initializeApi();
        if (!initSuccess) {
          console.warn("Kakao Maps API initialization failed");
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      console.log("map prop이 없어서 초기화하지 않음");
    }
  }, [map]);

  // 키워드 검색을 요청하는 함수
  const searchPlaces = (searchKeyword?: string) => {
    const searchTerm = searchKeyword || keyword;

    if (!searchTerm.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    if (!psRef.current || !isInitialized) {
      console.error("Places service is not initialized");
      console.error("psRef.current:", psRef.current);
      console.error("isInitialized:", isInitialized);
      alert("지도 서비스를 초기화하는 중입니다. 잠시 후 다시 시도해주세요.");
      return false;
    }

    setIsLoading(true);

    // 장소검색 객체를 통해 키워드로 장소검색을 요청
    try {
      psRef.current.keywordSearch(searchTerm, placesSearchCB);
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
      alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 장소검색이 완료됐을 때 호출되는 콜백함수
  const placesSearchCB = (
    data: Place[],
    status: any,
    pagination: Pagination
  ) => {
    setIsLoading(false);

    const kakao = (window as any).kakao;

    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면 검색 목록만 표출 (마커 없이)
      setPlaces(data);
      setPagination(pagination);
      setCurrentPage(pagination.current);
      setShowResults(true); // 검색 결과 표시
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      setPlaces([]);
      setPagination(null);
      setShowResults(false);
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      setPlaces([]);
      setPagination(null);
      setShowResults(false);
    }
  };

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    if (pagination) {
      pagination.gotoPage(page);
      setCurrentPage(page);
    }
  };

  // 장소 선택 처리
  const handlePlaceSelect = (place: Place) => {
    console.log("장소 선택됨:", place);
    console.log("map 객체:", map);
    console.log("kakao 객체:", (window as any).kakao);

    // 검색 input 텍스트를 선택한 장소명으로 변경
    setKeyword(place.place_name);
    console.log("검색 input 텍스트 변경:", place.place_name);

    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
    setShowResults(false);

    // 지도와 kakao 객체가 모두 준비된 경우에만 실행
    if (map && (window as any).kakao) {
      const kakao = (window as any).kakao;

      console.log("좌표 변환 전:", { x: place.x, y: place.y });

      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // 새로운 마커 생성
      const position = new kakao.maps.LatLng(Number(place.y), Number(place.x));

      console.log("생성된 position:", position);
      console.log("위도:", position.getLat(), "경도:", position.getLng());

      const marker = new kakao.maps.Marker({
        map,
        position,
      });
      markersRef.current.push(marker);

      map.setCenter(position);
    } else {
      console.error("map 또는 kakao 객체가 없습니다:", {
        map: !!map,
        kakao: !!(window as any).kakao,
      });
    }
  };

  // 검색 입력 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces();
  };

  const isApiReady = isInitialized && psRef.current;

  console.log(
    "MapSearchBar 렌더링 - isApiReady:",
    isApiReady,
    "isInitialized:",
    isInitialized,
    "psRef.current:",
    !!psRef.current
  );

  return (
    <div className={styles.map_search_bar_container}>
      <form onSubmit={handleSearch}>
        <input
          className={styles.map_search_bar}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={isApiReady ? "주소를 입력하세요." : "지도 로딩 중..."}
          disabled={!isApiReady}
        />
        <button
          type="submit"
          className={styles.search_button}
          disabled={!isApiReady || isLoading}
        >
          <img
            className={styles.search_icon}
            src="/icons/search.svg"
            alt="search"
          />
        </button>
      </form>

      {/* 검색 결과 목록 - 마커 없이 텍스트만 */}
      {showResults && places.length > 0 && (
        <div className={styles.search_results}>
          <ul className={styles.places_list}>
            {places.map((place, index) => (
              <li
                key={`${place.place_name}-${index}`}
                className={styles.place_item}
                onClick={() => handlePlaceSelect(place)}
              >
                <div className={styles.place_info}>
                  <span className={styles.place_name}>{place.place_name}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          {pagination && pagination.last > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: pagination.last }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.page_button} ${
                      page === currentPage ? styles.active : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}

      {isLoading && <div className={styles.loading}>검색 중...</div>}
    </div>
  );
};

export default MapSearchBar;
