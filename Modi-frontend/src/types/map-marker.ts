// 지도 마커 응답 바디 인터페이스
export interface MapMarkerResponse {
  id: number;
  datetime: string;
  emotion: string;
  location: {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
  };
  thumbnailUrl: string;
}

// 지도 viewport 파라미터 인터페이스
export interface ViewportParams {
  swLat: number; // southwest latitude (남서쪽 위도)
  swLng: number; // southwest longitude (남서쪽 경도)
  neLat: number; // northeast latitude (북동쪽 위도)
  neLng: number; // northeast longitude (북동쪽 경도)
}

// 에러 응답 인터페이스
export interface ErrorResponse {
  message: string;
  status: number;
}
