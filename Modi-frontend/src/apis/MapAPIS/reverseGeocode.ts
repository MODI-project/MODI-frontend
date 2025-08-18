// 카카오 Local 역지오코딩: 좌표 → 동(행정동) 이름
// 반환: { dong, fullAddress? } | null

export interface ReverseGeocodeResult {
  dong: string;
  fullAddress?: string;
}

export async function reverseToDong(
  lat: number,
  lon: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
    if (!REST_API_KEY) {
      console.warn("[reverseToDong] VITE_KAKAO_API_KEY 누락");
    }
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
    });
    if (!res.ok) {
      console.warn("[reverseToDong] kakao 응답 오류:", res.status);
      return null;
    }
    const data = await res.json();
    const docs: any[] = Array.isArray(data?.documents) ? data.documents : [];
    const h = docs.find((d) => d?.region_type === "H");
    const dong: string | undefined = h?.region_3depth_name;
    if (!dong) return null;
    return { dong, fullAddress: h?.address_name };
  } catch (e) {
    console.error("[reverseToDong] failed:", e);
    return null;
  }
}
