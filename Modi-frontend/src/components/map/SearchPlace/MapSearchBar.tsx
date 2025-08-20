import React, { useState, useEffect, useRef } from "react";
import styles from "./MapSearchBar.module.css";

// 통합 검색 결과 타입
interface SearchResult {
  title: string; // 표시용 이름(장소명 또는 도로명)
  address_name: string; // 전체 주소
  x: string; // lon
  y: string; // lat
}

interface Pagination {
  current: number;
  last: number;
  gotoPage: (page: number) => void;
}

interface MapSearchBarProps {
  map?: any;
  onPlaceSelect?: (place: SearchResult) => void;
  currentPosition?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({
  map,
  onPlaceSelect,
  currentPosition,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [places, setPlaces] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const markersRef = useRef<any[]>([]);
  const infowindowRef = useRef<any>(null);
  const psRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // API 초기화
  const initializeApi = () => {
    if (!map) {
      return false;
    }

    // map 객체를 통해 kakao API에 접근
    const kakao = (window as any).kakao;

    if (typeof kakao !== "undefined" && kakao.maps && kakao.maps.services) {
      try {
        // 장소 검색 객체 생성
        psRef.current = new kakao.maps.services.Places();
        // 지오코더 객체 생성
        geocoderRef.current = new kakao.maps.services.Geocoder();

        // 인포윈도우 생성
        infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });

        setIsInitialized(true);
        return true;
      } catch (error) {
        setIsInitialized(false);
        return false;
      }
    } else {
      setIsInitialized(false);
      return false;
    }
  };

  useEffect(() => {
    // map prop이 있을 때만 초기화 시도
    if (map) {
      // 약간의 지연을 두고 초기화 시도 (카카오맵 API가 완전히 로드될 시간을 줌)
      const timer = setTimeout(() => {
        const initSuccess = initializeApi();
        if (!initSuccess) {
          console.warn("카카오맵 API 초기화 실패");
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      console.log("map prop이 없어서 초기화하지 않음");
    }
  }, [map]);

  // 주소 결과를 통합 타입으로 변환
  const mapAddressResult = (item: any): SearchResult => {
    return {
      title: item.road_address?.address_name || item.address_name,
      address_name: item.address_name,
      x: item.x,
      y: item.y,
    };
  };

  // 장소 결과를 통합 타입으로 변환
  const mapPlaceResult = (item: any): SearchResult => {
    return {
      title: item.place_name,
      address_name: item.road_address_name || item.address_name,
      x: item.x,
      y: item.y,
    };
  };

  // 키워드 검색을 요청하는 함수
  const searchPlaces = (searchKeyword?: string) => {
    const searchTerm = searchKeyword || keyword;

    if (!searchTerm.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    if ((!psRef.current && !geocoderRef.current) || !isInitialized) {
      alert("지도 서비스를 초기화하는 중입니다. 잠시 후 다시 시도해주세요.");
      return false;
    }

    setIsLoading(true);

    const kakao = (window as any).kakao;

    // 1) 주소 검색 우선 시도
    if (geocoderRef.current) {
      try {
        geocoderRef.current.addressSearch(
          searchTerm,
          (data: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && data.length > 0) {
              const results = data.map(mapAddressResult);
              setPlaces(results);
              setPagination(null); // 주소 검색엔 페이지네이션 없음
              setCurrentPage(1);
              setShowResults(true);
              setIsLoading(false);
            } else {
              // 2) 주소 결과가 없으면 키워드 장소검색으로 폴백
              try {
                psRef.current.keywordSearch(searchTerm, placesSearchCB);
              } catch (error) {
                console.error("Search error:", error);
                setIsLoading(false);
                alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
              }
            }
          }
        );
        return;
      } catch (e) {
        // 지오코더 예외 시 바로 폴백
      }
    }

    // 폴백: 키워드 장소검색
    try {
      psRef.current.keywordSearch(searchTerm, placesSearchCB);
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
      alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 장소검색이 완료됐을 때 호출되는 콜백함수
  const placesSearchCB = (data: any[], status: any, pagination: Pagination) => {
    setIsLoading(false);

    const kakao = (window as any).kakao;

    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면 검색 목록만 표출 (마커 없이)
      const results = data.map(mapPlaceResult);
      setPlaces(results);
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

  // 장소/주소 선택 처리
  const handlePlaceSelect = (place: SearchResult) => {
    // 검색 input 텍스트를 선택한 항목으로 변경
    setKeyword(place.title);

    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
    setShowResults(false);

    // 지도와 kakao 객체가 모두 준비된 경우에만 실행
    if (map && (window as any).kakao) {
      const kakao = (window as any).kakao;

      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // 새로운 마커 생성
      const position = new kakao.maps.LatLng(Number(place.y), Number(place.x));

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

  const isApiReady = isInitialized && (psRef.current || geocoderRef.current);

  return (
    <div className={styles.map_search_bar_container}>
      <form onSubmit={handleSearch}>
        <input
          className={styles.map_search_bar}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={"주소를 입력하세요"}
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

      {/* 검색 결과 목록 - 주소/장소 공통 */}
      {showResults && places.length > 0 && (
        <div className={styles.search_results}>
          <ul className={styles.places_list}>
            {places.map((place, index) => (
              <li
                key={`${place.title}-${index}`}
                className={styles.place_item}
                onClick={() => handlePlaceSelect(place)}
              >
                <div className={styles.place_info}>
                  <span className={styles.place_name}>{place.title}</span>
                  {place.address_name && (
                    <span className={styles.place_addr}>
                      {place.address_name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 - 장소검색일 때만 노출 */}
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
