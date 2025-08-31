export const loadKakaoMapAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      console.log("카카오맵 API가 이미 로드되어 있습니다.");
      resolve();
      return;
    }

    // API 키 확인
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    if (!apiKey || apiKey === "your_kakao_map_api_key_here") {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      console.error(
        "프로젝트 루트에 .env 파일을 생성하고 VITE_KAKAO_MAP_API_KEY를 설정해주세요."
      );
      reject(new Error("카카오맵 API 키가 설정되지 않았습니다."));
      return;
    }

    console.log("카카오맵 API 스크립트 로딩 시작...");

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;

    script.onload = () => {
      console.log("카카오맵 API 스크립트 로드 완료");
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 초기화 완료");
        resolve();
      });
    };

    script.onerror = () => {
      console.error("카카오맵 API 스크립트 로드 실패");
      reject(new Error("카카오 지도 API 로드 실패"));
    };

    document.head.appendChild(script);
  });
};
