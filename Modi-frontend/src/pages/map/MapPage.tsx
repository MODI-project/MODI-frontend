import styles from "./MapPage.module.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchDiariesByViewport } from "../../apis/diaryInfo";
import MapMarker from "../../components/map/MapMarking/MapMarker";
import { loadKakaoMapAPI } from "../../utils/kakaoMapLoader";
import KakaoMap from "../../components/map/LoadMap/KakaoMap";
import MapSearchBar from "../../components/map/SearchPlace/MapSearchBar";
import Footer from "../../components/common/Footer";
import { useCharacter } from "../../contexts/CharacterContext";
import LocationDiariesBottomSheet from "../../components/map/MapMarking/LocationDiariesBottomSheet";
import { useGeolocation } from "../../contexts/GeolocationContext";
import { useNavigate } from "react-router-dom";

interface Diary {
  id: number;
  lat?: number;
  lng?: number;
  emotion: string;
  postCount: number;
  dong?: string;
}

const MapPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const { character } = useCharacter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  // 현재 위치 정보 가져오기
  const { lat, lng, startTracking } = useGeolocation();
  const navigate = useNavigate();

  const loadMap = async () => {
    try {
      setLoading(true);
      setError(null);

      await loadKakaoMapAPI();

      setLoaded(true);
      setLoading(false);
    } catch (err) {
      console.error("카카오맵 API 로딩 실패:", err);
      setError("지도를 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  // 페이지 진입 시 위치 추적 시작
  useEffect(() => {
    startTracking();
  }, [startTracking]);

  useEffect(() => {
    loadMap();
  }, []);
  // 지도 뷰포트 기반 일기 데이터 로드
  const loadDiariesByViewport = async (map: any) => {
    if (!map) return;

    try {
      // 지도의 현재 뷰포트 경계 가져오기
      const bounds = map.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      // 뷰포트 경계에 약간의 여유 추가 (0.01도 ≈ 1km)
      const buffer = 0.01;
      const expandedViewport = {
        swLat: swLatLng.getLat() - buffer,
        swLng: swLatLng.getLng() - buffer,
        neLat: neLatLng.getLat() + buffer,
        neLng: neLatLng.getLng() + buffer,
      };

      const diaryData = await fetchDiariesByViewport(
        expandedViewport.swLat,
        expandedViewport.swLng,
        expandedViewport.neLat,
        expandedViewport.neLng
      );

      // 같은 '동'의 일기들을 그룹화
      const dongGroups = new Map<string, any[]>();

      diaryData.forEach((d: any) => {
        const dong = d.location?.address?.split(" ").pop() || "unknown"; // 주소에서 '동' 추출
        const lat = d.location?.latitude || d.latitude;
        const lng = d.location?.longitude || d.longitude;
        const key = `${dong}`; // '동'을 키로 사용

        if (!dongGroups.has(key)) {
          dongGroups.set(key, []);
        }
        dongGroups.get(key)!.push(d);
      });

      const mapped: Diary[] = Array.from(dongGroups.entries()).map(
        ([dong, diaries]) => {
          // 같은 '동'의 일기들을 날짜순으로 정렬하여 가장 최근 일기 찾기
          const sortedDiaries = diaries.sort(
            (a, b) =>
              new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          );
          const latestDiary = sortedDiaries[0]; // 가장 최근 일기

          const lat = latestDiary.location?.latitude || latestDiary.latitude;
          const lng = latestDiary.location?.longitude || latestDiary.longitude;

          return {
            id: latestDiary.id, // 가장 최근 일기의 ID 사용
            lat,
            lng,
            emotion: latestDiary.emotion, // 가장 최근 일기의 감정 사용
            postCount: diaries.length, // 해당 '동'의 일기 개수
            dong: dong, // '동' 정보 추가
          };
        }
      );

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

      setDiaries(validMarkers);
    } catch (error) {
      console.error("뷰포트 기반 일기 데이터 로드 실패:", error);
      setDiaries([]); // 에러 시 빈 배열로 설정
    }
  };

  // 지도가 준비되면 초기 일기 데이터 로드
  useEffect(() => {
    if (mapInstance) {
      loadDiariesByViewport(mapInstance);
    }
  }, [mapInstance]);

  const handlePlaceSelect = useCallback(
    (place: any) => {
      // 현재 위치 정보가 있으면 선택된 장소 대신 현재 위치 사용
      if (currentPosition) {
        if (mapInstance) {
          try {
            const kakao = (window as any).kakao;
            if (kakao && kakao.maps) {
              const newCenter = new kakao.maps.LatLng(
                currentPosition.lat,
                currentPosition.lng
              );

              // 지도 중심 이동
              mapInstance.setCenter(newCenter);

              // 적절한 확대 레벨로 설정 (상세한 뷰)
              mapInstance.setLevel(3);
            }
          } catch (error) {}
        }
      } else {
        // 현재 위치 정보가 없으면 기존 로직 사용
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
            }
          } catch (error) {}
        }
      }
    },
    [mapInstance, currentPosition]
  );

  const handleRetry = useCallback(() => {
    loadMap();
  }, []);

  const handleDiaryClick = useCallback(
    (diaryId: number) => {
      navigate(`/recorddetail`, { state: { diaryId } });
    },
    [navigate]
  );

  const handleMapReady = useCallback(
    (map: any) => {
      setMapInstance(map);

      // 현재 위치가 있으면 지도 중심을 현재 위치로 이동
      if (lat && lng) {
        const kakao = (window as any).kakao;
        if (kakao && kakao.maps) {
          const currentPos = new kakao.maps.LatLng(lat, lng);
          map.setCenter(currentPos);
        }
      }

      // 지도 이벤트 리스너 추가
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        // 지도 이동/줌 이벤트 리스너 - 뷰포트 변경 시 일기 데이터 다시 로드
        kakao.maps.event.addListener(map, "bounds_changed", async () => {
          await loadDiariesByViewport(map);
        });
      }
    },
    [lat, lng]
  );

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
                latitude={lat || 37.5407923} // 현재 위치가 있으면 사용, 없으면 기본값
                longitude={lng || 127.0710699}
                showSearchBar={false}
                onMapReady={handleMapReady}
                onCurrentPositionChange={setCurrentPosition}
              />
            </div>

            {/* 검색바 오버레이 - mapInstance가 있을 때만 렌더링 */}
            {mapInstance && (
              <>
                <div className={styles.search_bar_container}>
                  <MapSearchBar
                    map={mapInstance}
                    onPlaceSelect={handlePlaceSelect}
                    currentPosition={currentPosition}
                  />
                </div>

                {/* 마커 렌더링 */}
                {diaries.map((d, idx) => (
                  <MapMarker
                    key={`${d.id}-${idx}`}
                    map={mapInstance}
                    diary={d}
                    character={character!}
                    onClick={(position) => {
                      setSelectedPosition(position);
                      setSheetOpen(true);
                    }}
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
        <LocationDiariesBottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          position={selectedPosition}
          onClickDiary={handleDiaryClick}
        />
        <Footer />
      </div>
    </div>
  );
};

export default MapPage;
