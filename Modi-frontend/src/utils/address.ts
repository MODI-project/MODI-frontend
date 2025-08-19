const METRO = [
  "서울",
  "포항",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "제주",
];

const stripTrailingNumbers = (parts: string[]) =>
  parts.filter((p) => !/^\d+(-\d+)?$/.test(p)); // 예: 1, 12-3 같은 숫자 토큰 제거

const normalizeSiName = (siRaw: string) =>
  siRaw.replace(/특별자치시$|특별시$|광역시$/, "시");

export function formatVisitLabel(address: string): string {
  if (!address) return "";
  const rawParts = address.trim().split(/\s+/);
  const parts = stripTrailingNumbers(rawParts);

  // 1) 시 찾기
  let siIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (/시$/.test(p)) {
      siIdx = i;
      break;
    }
    if (/특별시$|광역시$|특별자치시$/.test(p)) {
      siIdx = i;
      break;
    }
    if (
      /도$/.test(p) &&
      i + 1 < parts.length &&
      /(시|군)$/.test(parts[i + 1])
    ) {
      siIdx = i + 1;
      break;
    }
  }

  // (보완) '서울', '부산' 등 축약형
  if (siIdx === -1 && METRO.includes(parts[0])) {
    // 첫 토큰을 시로 간주
    parts[0] = parts[0] + "시";
    siIdx = 0;
  }

  const siName = siIdx >= 0 ? normalizeSiName(parts[siIdx]) : "";

  // 2) 동/읍/면/로 찾기
  const dong = [...parts].reverse().find((p) => /(동|읍|면|로)$/.test(p));

  if (dong) {
    // ‘구’는 항상 제거
    return `${siName || parts[0]} ${dong}`
      .replace(/(\S+?)구(?=\s|$)/g, "$1")
      .trim();
  }

  // 3) 동이 없으면 구(접미사 제거) 사용
  const gu = parts.find((p) => /구$/.test(p));
  if (gu) {
    return `${siName || parts[0]} ${gu.replace(/구$/, "")}`.trim();
  }

  // 4) 그래도 없으면 시만
  return (siName || parts[0] || "").trim();
}
