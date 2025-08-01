import styles from "./MapPage.module.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { mockDiaries } from "../../apis/diaryInfo";
import { DiaryData } from "../../apis/diaryInfo";
import MapMarker from "../../components/map/MapMarker";
import { loadKakaoMapAPI } from "../../utils/kakaoMapLoader";
import KakaoMap from "../../components/map/KakaoMap";
import MapSearchBar from "../../components/map/MapSearchBar";
import Footer from "../../components/common/Footer";

interface Diary {
  id: number;
  lat: number;
  lng: number;
  emotion: string;
  postCount: number;
}

const MapPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);

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
  useEffect(() => {
    const mapped: Diary[] = mockDiaries.map((d: DiaryData) => ({
      id: Number(d.id),
      lat: d.latitude,
      lng: d.longitude,
      emotion: d.emotion,
      postCount: 1,
    }));
    setDiaries(mapped);
  }, []);

  const handlePlaceSelect = useCallback(
    (place: any) => {
      console.log("선택된 장소:", place);

      // 선택된 장소로 지도 이동
      if (mapInstance && place.x && place.y) {
        try {
          const kakao = (window as any).kakao;
          if (kakao && kakao.maps) {
            const newCenter = new kakao.maps.LatLng(
              parseFloat(place.y),
              parseFloat(place.x)
            );

            // 지도 중심 이동
            mapInstance.setCenter(newCenter);

            // 적절한 확대 레벨로 설정 (상세한 뷰)
            mapInstance.setLevel(3);

            console.log("지도 이동 완료:", {
              place: place.place_name,
              lat: place.y,
              lng: place.x,
            });
          }
        } catch (error) {
          console.error("지도 이동 중 오류 발생:", error);
        }
      }
    },
    [mapInstance]
  );

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
                maxWidth: "400px",
                minHeight: "500px", // 최소 높이 증가
                height: "calc(100vh)", // 뷰포트 높이에서 푸터 등 제외
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
              <>
                <div className={styles.search_bar_container}>
                  <MapSearchBar
                    map={mapInstance}
                    onPlaceSelect={handlePlaceSelect}
                  />
                </div>
                {/* 2) 마커 렌더링 */}
                {diaries.map((d) => (
                  <MapMarker
                    key={d.id}
                    map={mapInstance}
                    diary={d}
                    character={"momo"} // CharacterContext 등에서 실제값을 가져오세요
                  />
                ))}
              </>
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
