type DongCoord = { latitude: number; longitude: number };
const DONG_CACHE_KEY = "dong-centroids-v1";

function loadCache(): Record<string, DongCoord> {
  try {
    return JSON.parse(localStorage.getItem(DONG_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCache(cache: Record<string, DongCoord>) {
  localStorage.setItem(DONG_CACHE_KEY, JSON.stringify(cache));
}

export async function getDongRepresentativeCoords(
  dong: string,
  REST_API_KEY: string
): Promise<DongCoord | null> {
  const cache = loadCache();
  if (cache[dong]) return cache[dong];

  const hit1 = await searchKakaoKeywordFirst(
    `${dong} 행정복지센터`,
    REST_API_KEY
  );
  if (hit1) {
    cache[dong] = hit1;
    saveCache(cache);
    return hit1;
  }

  const hit2 = await searchKakaoKeywordFirst(`${dong} 주민센터`, REST_API_KEY);
  if (hit2) {
    cache[dong] = hit2;
    saveCache(cache);
    return hit2;
  }

  const hit3 = await searchKakaoAddressFirst(dong, REST_API_KEY);
  if (hit3) {
    cache[dong] = hit3;
    saveCache(cache);
    return hit3;
  }

  return null;
}

type KakaoDoc = { x: string; y: string };

async function searchKakaoKeywordFirst(
  query: string,
  REST_API_KEY: string
): Promise<DongCoord | null> {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
    query
  )}&size=1`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const doc: KakaoDoc | undefined = data.documents?.[0];
  if (!doc) return null;
  return { latitude: parseFloat(doc.y), longitude: parseFloat(doc.x) };
}

async function searchKakaoAddressFirst(
  query: string,
  REST_API_KEY: string
): Promise<DongCoord | null> {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    query
  )}&size=1`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const doc: KakaoDoc | undefined = data.documents?.[0];
  if (!doc) return null;
  return { latitude: parseFloat(doc.y), longitude: parseFloat(doc.x) };
}
