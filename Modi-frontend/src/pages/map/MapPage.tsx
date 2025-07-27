import styles from "./MapPage.module.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { loadKakaoMapAPI } from "../../utils/kakaoMapLoader";
import KakaoMap from "../../components/map/KakaoMap";
import MapSearchBar from "../../components/map/MapSearchBar";
import Footer from "../../components/common/Footer";

const MapPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const loadMap = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("카카오맵 API 로딩 시작...");
      console.log(
        "API 키 확인:",
        import.meta.env.VITE_KAKAO_MAP_API_KEY ? "설정됨" : "설정되지 않음"
      );

      await loadKakaoMapAPI();

      console.log("카카오맵 API 로딩 완료!");
      console.log(
        "window.kakao 확인:",
        typeof window.kakao !== "undefined" ? "존재함" : "존재하지 않음"
      );
      console.log(
        "window.kakao.maps 확인:",
        window.kakao?.maps ? "존재함" : "존재하지 않음"
      );

      setLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error("카카오맵 API 로딩 실패:", err);
      setError("지도를 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMap();
  }, []);

  const handlePlaceSelect = useCallback((place: any) => {
    console.log("선택된 장소:", place);
    // 선택된 장소 정보 처리
  }, []);

  const handleRetry = useCallback(() => {
    loadMap();
  }, []);

  const handleMapReady = useCallback((map: any) => {
    console.log("지도 인스턴스 생성 완료:", map);
    setMapInstance(map);
  }, []);

  if (loading) {
    return (
      <div className={styles.map_page_wrapper}>
        <div className={styles.map_page_container}>
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p className={styles.loading_text}>지도를 불러오는 중...</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.map_page_wrapper}>
        <div className={styles.map_page_container}>
          <div className={styles.error_container}>
            <p className={styles.error_text}>{error}</p>
            <button className={styles.retry_button} onClick={handleRetry}>
              다시 시도
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.map_page_wrapper}>
      <div className={styles.map_page_container}>
        {loaded ? (
          <>
            {/* 지도 컴포넌트 */}
            <div
              className={styles.map_container}
              style={{
                minHeight: "500px", // 최소 높이 증가
                height: "calc(100vh - 200px)", // 뷰포트 높이에서 푸터 등 제외
              }}
            >
              <KakaoMap
                latitude={37.5407923}
                longitude={127.0710699}
                showSearchBar={false}
                onMapReady={handleMapReady}
              />
            </div>

            {/* 검색바 오버레이 - mapInstance가 있을 때만 렌더링 */}
            {mapInstance && (
              <div className={styles.search_bar_container}>
                <MapSearchBar
                  map={mapInstance}
                  onPlaceSelect={handlePlaceSelect}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p className={styles.loading_text}>지도를 초기화하는 중...</p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default MapPage;
