export interface AddressResult {
  fullAddress: string;
  dong: string;
  latitude: number;
  longitude: number;
}

// 대체 좌표를 찾는 함수
async function findFallbackCoords(
  address: string,
  dong: string,
  REST_API_KEY: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // 1. 동명으로 키워드 검색 시도
    const keywordResponse = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        `${dong} 행정복지센터`
      )}&size=1`,
      {
        headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
      }
    );

    if (keywordResponse.ok) {
      const keywordData = await keywordResponse.json();
      const doc = keywordData.documents?.[0];
      if (doc?.x && doc?.y) {
        return {
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
        };
      }
    }

    // 2. 전체 주소로 다시 주소 검색 시도
    const addressResponse = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}&size=1`,
      {
        headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
      }
    );

    if (addressResponse.ok) {
      const addressData = await addressResponse.json();
      const doc = addressData.documents?.[0];
      if (doc?.x && doc?.y) {
        return {
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("대체 좌표 검색 실패:", error);
    return null;
  }
}

export const searchKakaoAddress = async (
  query: string
): Promise<AddressResult[]> => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    }
  );

  if (!response.ok) throw new Error("주소 검색 실패");

  const data = await response.json();

  interface KakaoAddressDocument {
    x?: string;
    y?: string;
    address?: {
      address_name: string;
      region_3depth_name: string;
    };
    road_address?: {
      address_name: string;
    };
  }

  const getFullAddress = (doc: KakaoAddressDocument) =>
    doc.address?.address_name ?? doc.road_address?.address_name ?? "";

  // 동 정보가 있는 문서들만 필터링 (좌표는 나중에 처리)
  const validDocs = (data.documents as KakaoAddressDocument[]).filter(
    (doc) => !!doc.address?.region_3depth_name
  );

  // 각 문서에 대해 좌표 처리
  const results: AddressResult[] = [];

  for (const doc of validDocs) {
    const fullAddress = getFullAddress(doc);
    const dong = doc.address!.region_3depth_name;

    let latitude: number;
    let longitude: number;

    // 1. 원본 좌표가 있으면 사용
    if (doc.x && doc.y) {
      latitude = parseFloat(doc.x);
      longitude = parseFloat(doc.y);
    } else {
      // 2. 대체 좌표 찾기
      const fallbackCoords = await findFallbackCoords(
        fullAddress,
        dong,
        REST_API_KEY
      );
      if (fallbackCoords) {
        latitude = fallbackCoords.latitude;
        longitude = fallbackCoords.longitude;
      } else {
        // 3. 대체 좌표도 없으면 건너뛰기
        continue;
      }
    }

    results.push({
      fullAddress,
      dong,
      latitude,
      longitude,
    });
  }

  return results;
};
