import styles from "./MapPage.module.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { mockDiaries } from "../../apis/diaryInfo";
import MapMarker from "../../components/map/MapMarking/MapMarker";
import { loadKakaoMapAPI } from "../../utils/kakaoMapLoader";
import KakaoMap from "../../components/map/LoadMap/KakaoMap";
import MapSearchBar from "../../components/map/SearchPlace/MapSearchBar";
import Footer from "../../components/common/Footer";
import { useCharacter } from "../../contexts/CharacterContext";

interface Diary {
  id: number;
  lat?: number;
  lng?: number;
  emotion: string;
  postCount: number;
}

const MapPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const { character } = useCharacter();

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
    console.log("=== mockDiaries 원본 데이터 ===");
    console.log("mockDiaries 개수:", mockDiaries.length);
    mockDiaries.forEach((diary, index) => {
      console.log(`원본 데이터 ${index + 1}:`, {
        id: diary.id,
        latitude: diary.latitude,
        longitude: diary.longitude,
        emotion: diary.emotion,
        address: diary.address,
      });
    });

    const mapped: Diary[] = mockDiaries.map((d) => ({
      id: d.id,
      lat: d.latitude, // number 인 것이 보장됨
      lng: d.longitude,
      emotion: d.emotion,
      postCount: 1,
    }));

    console.log("=== 변환된 마커 데이터 ===");
    console.log("마커 데이터 설정:", mapped);
    console.log("마커 개수:", mapped.length);
    mapped.forEach((diary, index) => {
      console.log(`마커 ${index + 1}:`, {
        id: diary.id,
        lat: diary.lat,
        lng: diary.lng,
        emotion: diary.emotion,
        postCount: diary.postCount,
      });
    });

    // 좌표 유효성 검사
    const validMarkers = mapped.filter((diary) => {
      const isValid =
        diary.lat &&
        diary.lng &&
        !isNaN(diary.lat) &&
        !isNaN(diary.lng) &&
        diary.lat !== 0 &&
        diary.lng !== 0;

      if (!isValid) {
        console.warn(`유효하지 않은 마커 좌표:`, diary);
      }
      return isValid;
    });

    console.log("=== 유효한 마커 데이터 ===");
    console.log("유효한 마커 개수:", validMarkers.length);
    validMarkers.forEach((diary, index) => {
      console.log(`유효한 마커 ${index + 1}:`, {
        id: diary.id,
        lat: diary.lat,
        lng: diary.lng,
        emotion: diary.emotion,
      });
    });

    setDiaries(validMarkers);
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

    // 지도 이벤트 리스너 추가 (선택사항)
    const kakao = (window as any).kakao;
    if (kakao && kakao.maps) {
      // 지도 이동/줌 이벤트 리스너 (현재는 비활성화)
      // kakao.maps.event.addListener(map, "bounds_changed", async () => {
      //   console.log("지도 영역 변경됨 - 마커 업데이트");
      // });
    }

    console.log("mockDiaries 데이터를 사용하여 마커 표시");
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
                {/* 마커 렌더링 */}
                {diaries.map((d, idx) => (
                  <MapMarker
                    key={`${d.id}-${idx}`}
                    map={mapInstance}
                    diary={d}
                    character={character!}
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
