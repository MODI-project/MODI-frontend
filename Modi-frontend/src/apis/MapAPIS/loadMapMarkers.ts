import axios from "axios";
import type {
  MapMarkerResponse,
  ViewportParams,
  ErrorResponse,
} from "../../types/map-marker";

const API_BASE_URL = "https://modidiary.store/api";

const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMyIsImlhdCI6MTc1NDMwNzc3NCwiZXhwIjoxNzU0MzExMzc0fQ.MfjtQsxMU4sEPOwiMoNVAl-3nTQioJFZHoPydt1HEx0";

export const loadMapMarkers = async (
  viewport: ViewportParams
): Promise<MapMarkerResponse[]> => {
  console.log("=== loadMapMarkers API 호출 시작 ===");
  console.log("API URL:", `${API_BASE_URL}/diaries/nearby`);
  console.log("Viewport 파라미터:", viewport);

  // 개발 환경에서 테스트용 기본 viewport
  const testViewport = {
    swLat: 37.123,
    swLng: 127.123,
    neLat: 37.456,
    neLng: 127.456,
  };

  try {
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
        Authorization: `Bearer ${accessToken}`,
      },
      //   withCredentials: true, // HttpOnly 쿠키 자동 전송
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
        const errorData: ErrorResponse = error.response.data;
        console.error("Viewport 파라미터 오류:", errorData.message);
        throw new Error(`Viewport 파라미터 오류: ${errorData.message}`);
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
