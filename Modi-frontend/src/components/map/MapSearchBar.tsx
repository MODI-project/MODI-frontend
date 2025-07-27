import React, { useState, useEffect, useRef } from "react";
import styles from "./MapSearchBar.module.css";

// 카카오맵 API 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

const kakao = window.kakao;

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

  const markersRef = useRef<any[]>([]);
  const infowindowRef = useRef<any>(null);
  const psRef = useRef<any>(null);

  // API 초기화
  const initializeApi = () => {
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
    // map prop이 있고 카카오맵 API가 사용 가능할 때만 초기화
    if (map && typeof kakao !== "undefined" && kakao.maps) {
      const initSuccess = initializeApi();
      if (!initSuccess) {
        console.warn("Kakao Maps API initialization failed");
      }
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

    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면 검색 목록과 마커를 표출
      setPlaces(data);
      setPagination(pagination);
      setCurrentPage(pagination.current);

      if (map) {
        displayPlaces(data);
      }
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      setPlaces([]);
      setPagination(null);
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      setPlaces([]);
      setPagination(null);
    }
  };

  // 검색 결과 목록과 마커를 표출하는 함수
  const displayPlaces = (placesData: Place[]) => {
    if (!map || typeof kakao === "undefined" || !kakao.maps) return;

    // 지도에 표시되고 있는 마커를 제거
    removeMarker();

    const bounds = new kakao.maps.LatLngBounds();

    placesData.forEach((place, index) => {
      // 마커를 생성하고 지도에 표시
      const placePosition = new kakao.maps.LatLng(
        parseFloat(place.y),
        parseFloat(place.x)
      );
      const marker = addMarker(placePosition, index, place.place_name);

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가
      bounds.extend(placePosition);

      // 마커에 이벤트 리스너 추가
      kakao.maps.event.addListener(marker, "mouseover", () => {
        displayInfowindow(marker, place.place_name);
      });

      kakao.maps.event.addListener(marker, "mouseout", () => {
        if (infowindowRef.current) {
          infowindowRef.current.close();
        }
      });

      kakao.maps.event.addListener(marker, "click", () => {
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
    });

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정
    map.setBounds(bounds);
  };

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수
  const addMarker = (position: any, idx: number, title: string): any => {
    if (!map || typeof kakao === "undefined" || !kakao.maps) {
      throw new Error("Map or API is not available");
    }

    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new kakao.maps.Marker({
      position: position,
      image: markerImage,
    });

    marker.setMap(map);
    markersRef.current.push(marker);

    return marker;
  };

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  const removeMarker = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
  const displayInfowindow = (marker: any, title: string) => {
    if (
      !infowindowRef.current ||
      !map ||
      typeof kakao === "undefined" ||
      !kakao.maps
    )
      return;

    const content = `<div style="padding:5px;z-index:1;">${title}</div>`;
    infowindowRef.current.setContent(content);
    infowindowRef.current.open(map, marker);
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
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  // 검색 입력 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces();
  };

  const isApiReady = isInitialized && psRef.current;

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

      {/* 검색 결과 목록 */}
      {places.length > 0 && (
        <div className={styles.search_results}>
          <ul className={styles.places_list}>
            {places.map((place, index) => (
              <li
                key={`${place.place_name}-${index}`}
                className={styles.place_item}
                onClick={() => handlePlaceSelect(place)}
                onMouseOver={() => {
                  if (map && markersRef.current[index]) {
                    displayInfowindow(
                      markersRef.current[index],
                      place.place_name
                    );
                  }
                }}
                onMouseOut={() => {
                  if (infowindowRef.current) {
                    infowindowRef.current.close();
                  }
                }}
              >
                <span
                  className={`${styles.marker_bg} ${
                    styles[`marker_${index + 1}`]
                  }`}
                ></span>
                <div className={styles.place_info}>
                  <h5>{place.place_name}</h5>
                  {place.road_address_name ? (
                    <>
                      <span>{place.road_address_name}</span>
                      <span className={styles.jibun}>{place.address_name}</span>
                    </>
                  ) : (
                    <span>{place.address_name}</span>
                  )}
                  <span className={styles.phone}>{place.phone}</span>
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
