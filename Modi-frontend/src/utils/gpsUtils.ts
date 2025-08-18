import ExifReader from "exifreader";

/** DMS 좌표 → DD 좌표 */
export function convertDMSToDD(dms: number[], ref: string): number {
  const [degrees, minutes, seconds] = dms;
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") dd *= -1;
  return dd;
}

/** 파일에서 GPS 태그 추출 */
export async function extractGpsFromFile(
  file: File
): Promise<{ lat: number; lon: number } | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = await ExifReader.load(arrayBuffer);

    const latRaw = tags["GPSLatitude"]?.value as [number, number][];
    const lonRaw = tags["GPSLongitude"]?.value as [number, number][];
    if (!latRaw || !lonRaw || latRaw.length !== 3 || lonRaw.length !== 3) {
      return null;
    }

    const parse = (dms: [number, number][]): number[] =>
      dms.map(([num, den]) => num / den);

    const lat = convertDMSToDD(
      parse(latRaw),
      tags["GPSLatitudeRef"]?.description || "N"
    );
    const lon = convertDMSToDD(
      parse(lonRaw),
      tags["GPSLongitudeRef"]?.description || "E"
    );

    return { lat, lon };
  } catch (err) {
    console.error("GPS 정보 추출 실패", err);
    return null;
  }
}

/** 카카오 역지오코딩 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  kakaoKey: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${kakaoKey}`,
        },
      }
    );
    const data = await res.json();
    return data.documents?.[0]?.address?.address_name ?? null;
  } catch (err) {
    console.error("역지오코딩 실패", err);
    return null;
  }
}
