export function extractSiDong(address: string): string {
  if (!address) return "";

  // 공백 기준 토큰화
  const parts = address.trim().split(/\s+/);

  // 1) '시/특별시/광역시/특별자치시' or '도' 다음의 '시/군'을 찾아 시 이름 구성
  const findSiIndex = () => {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (/시$/.test(p)) return i; // ex) 제주시, 전주시 (이미 '시'로 끝남)
      if (/특별시$|광역시$|특별자치시$/.test(p)) return i; // ex) 서울특별시, 인천광역시, 세종특별자치시
      if (/도$/.test(p)) {
        // '도'면 다음 토큰 중 '시|군'을 시로 간주
        if (i + 1 < parts.length && /(시|군)$/.test(parts[i + 1])) return i + 1;
      }
    }
    return -1;
  };

  const siIdx = findSiIndex();
  if (siIdx === -1) return ""; // 못 찾으면 빈 문자열

  const normalizeSiName = (siRaw: string) =>
    siRaw
      .replace(/특별자치시$|특별시$|광역시$/, "시")
      // '제주특별자치도 제주시'처럼 이미 '시'로 끝나면 유지
      .replace(/도$/, "도"); // 도로 끝나는 항목은 그대로(위에서 다음 '시/군'을 si로 잡았을 것)
  const siName = normalizeSiName(parts[siIdx]);

  // 2) 마지막에 나오는 동/읍/면 찾기 (일반적으로 '구/군' 다음에 위치)

  const dongEupMyeon = [...parts].reverse().find((p) => /(동|읍|면)$/.test(p));

  if (!dongEupMyeon) return siName;

  return `${siName} ${dongEupMyeon}`;
}
