import axios from "axios";
import type { MapMarkerResponse, ViewportParams } from "../../types/map-marker";

// 환경변수에서 API URL 가져오기 (개발환경에서는 localhost 사용)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// 개발환경에서는 하드코딩된 토큰 사용하지 않음
const accessToken = import.meta.env.VITE_ACCESS_TOKEN || "";

// 개발환경에서 사용할 mock 데이터
export const MOCK_NEARBY_DIARIES: MapMarkerResponse[] = [
  {
    id: 101,
    datetime: "2025-07-29T15:37:01.82931",
    emotion: "happy",
    location: {
      id: 1,
      address: "서울시 광진구 화양동",
      latitude: 37.5407923,
      longitude: 127.0710699,
    },
    thumbnailUrl: "https://example.com/thumbnail1.jpg",
  },
  {
    id: 102,
    datetime: "2025-07-30T15:37:01.82931",
    emotion: "sad",
    location: {
      id: 1,
      address: "서울시 광진구 화양동",
      latitude: 37.5507923,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
  },
  {
    id: 104,
    datetime: "2025-07-31T15:37:01.82931",
    emotion: "sad",
    location: {
      id: 1,
      address: "서울시 광진구 화양동",
      latitude: 37.5507923,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
  },
  {
    id: 105,
    datetime: "2025-08-01T15:37:01.82931",
    emotion: "sad",
    location: {
      id: 1,
      address: "서울시 광진구 화양동",
      latitude: 37.5507923,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
  },
  {
    id: 106,
    datetime: "2025-08-02T15:37:01.82931",
    emotion: "sad",
    location: {
      id: 1,
      address: "서울시 광진구 화양동",
      latitude: 37.5507923,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
  },
  {
    id: 103,
    datetime: "2025-07-29T15:37:01.82931",
    emotion: "excited",
    location: {
      id: 3,
      address: "서울시 광진구 화양동",
      latitude: 37.123456,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
  },
  {
    id: 107,
    datetime: "2025-07-29T17:37:01.82931",
    emotion: "excited",
    location: {
      id: 3,
      address: "서울시 광진구 화양동",
      latitude: 37.123456,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
  },
  {
    id: 108,
    datetime: "2025-07-29T20:37:01.82931",
    emotion: "excited",
    location: {
      id: 3,
      address: "서울시 광진구 화양동",
      latitude: 37.123456,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
  },
  {
    id: 109,
    datetime: "2025-07-29T21:37:01.82931",
    emotion: "excited",
    location: {
      id: 3,
      address: "서울시 광진구 화양동",
      latitude: 37.123456,
      longitude: 127.123456,
    },
    thumbnailUrl: "https://example.com/thumbnail3.jpg",
  },
];

export const loadMapMarkers = async (
  viewport: ViewportParams
): Promise<MapMarkerResponse[]> => {
  console.log("=== loadMapMarkers API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/diaries/nearby`);
  console.log("Viewport 파라미터:", viewport);

  // 개발환경에서는 mock 데이터 사용
  const isDevelopment = import.meta.env.DEV;
  if (isDevelopment) {
    console.log("🔄 개발환경 - Mock 데이터 사용");
    console.log("Mock 마커 데이터:", MOCK_NEARBY_DIARIES);

    // 실제 API 호출 대신 mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_NEARBY_DIARIES);
      }, 500); // 0.5초 지연으로 실제 API 호출 시뮬레이션
    });
  }

  try {
    console.log("🌐 프로덕션 환경 - 실제 API 호출");
    console.log("HttpOnly 쿠키 방식으로 인증 진행");
    console.log("현재 모든 쿠키:", document.cookie);
    console.log("쿠키 존재 여부:", document.cookie ? "있음" : "없음");

    const response = await axios.get(`${API_BASE_URL}/diaries/nearby`, {
      params: {
        swLat: viewport.swLat,
        swLng: viewport.swLng,
        neLat: viewport.neLat,
        neLng: viewport.neLng,
      },
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      withCredentials: true, // HttpOnly 쿠키 자동 전송
      timeout: 10000, // 10초 타임아웃
    });

    console.log("✅ 지도 마커 로드 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 지도 마커 로드 실패 - 상세 에러 정보:");
    console.error("에러 타입:", error.constructor.name);
    console.error("에러 메시지:", error.message);

    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);
      console.error("응답 헤더:", error.response.headers);

      // 400 에러 처리 (Invalid viewport parameters)
      if (error.response.status === 400) {
        console.error("Viewport 파라미터 오류");
      }
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
      throw new Error("서버에 연결할 수 없습니다.");
    } else {
      console.error("요청 설정 에러:", error.message);
      throw new Error("요청 설정 중 오류가 발생했습니다.");
    }

    throw error;
  }
};

// 지도 viewport 계산 유틸리티 함수
export const calculateViewport = (map: any): ViewportParams | null => {
  try {
    if (!map) {
      console.warn("지도 객체가 없습니다.");
      return null;
    }

    // 지도 객체 타입 확인
    console.log("지도 객체 타입:", typeof map);
    console.log("지도 객체 메서드:", Object.getOwnPropertyNames(map));

    // 카카오맵의 bounds 가져오기
    const bounds = map.getBounds();
    console.log("지도 bounds:", bounds);

    if (!bounds) {
      console.warn("지도 bounds를 가져올 수 없습니다.");
      return null;
    }

    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    console.log("남서쪽 좌표:", swLatLng);
    console.log("북동쪽 좌표:", neLatLng);

    const viewport: ViewportParams = {
      swLat: swLatLng.getLat(),
      swLng: swLatLng.getLng(),
      neLat: neLatLng.getLat(),
      neLng: neLatLng.getLng(),
    };

    console.log("계산된 viewport:", viewport);

    // 좌표 유효성 검사
    if (
      isNaN(viewport.swLat) ||
      isNaN(viewport.swLng) ||
      isNaN(viewport.neLat) ||
      isNaN(viewport.neLng)
    ) {
      console.error("유효하지 않은 좌표:", viewport);
      return null;
    }

    return viewport;
  } catch (error) {
    console.error("Viewport 계산 중 오류:", error);
    return null;
  }
};

// 지도 이동/줌 이벤트에 따른 마커 업데이트
export const updateMapMarkers = async (
  map: any
): Promise<MapMarkerResponse[]> => {
  const viewport = calculateViewport(map);

  if (!viewport) {
    console.warn("Viewport를 계산할 수 없습니다. 테스트용 viewport 사용");
    // 테스트용 기본 viewport 사용
    const testViewport: ViewportParams = {
      swLat: 37.123,
      swLng: 127.123,
      neLat: 37.456,
      neLng: 127.456,
    };
    return await loadMapMarkers(testViewport);
  }

  return await loadMapMarkers(viewport);
};

// 테스트용 함수 (지도 객체 없이도 사용 가능)
export const testLoadMapMarkers = async (): Promise<MapMarkerResponse[]> => {
  const testViewport: ViewportParams = {
    swLat: 37.123,
    swLng: 127.123,
    neLat: 37.456,
    neLng: 127.456,
  };

  console.log("테스트용 viewport로 마커 로드:", testViewport);
  return await loadMapMarkers(testViewport);
};
