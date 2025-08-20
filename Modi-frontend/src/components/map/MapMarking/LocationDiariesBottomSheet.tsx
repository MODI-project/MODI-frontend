import { useEffect, useMemo, useState } from "react";
import BottomSheet from "../../common/BottomSheet";
import styles from "./LocationDiariesBottomSheet.module.css";
import axios from "axios";

// 주소 정규화 함수: 행정구역명 차이를 통일
function normalizeAddress(address: string): string {
  if (!address) return "";

  return address
    .replace(/^부산광역시\s/, "부산 ")
    .replace(/^서울특별시\s/, "서울 ")
    .replace(/^대구광역시\s/, "대구 ")
    .replace(/^인천광역시\s/, "인천 ")
    .replace(/^광주광역시\s/, "광주 ")
    .replace(/^대전광역시\s/, "대전 ")
    .replace(/^울산광역시\s/, "울산 ")
    .replace(/^세종특별자치시\s/, "세종 ")
    .replace(/^제주특별자치도\s/, "제주 ")
    .replace(/^강원도\s/, "강원 ")
    .replace(/^충청북도\s/, "충북 ")
    .replace(/^충청남도\s/, "충남 ")
    .replace(/^전라북도\s/, "전북 ")
    .replace(/^전라남도\s/, "전남 ")
    .replace(/^경상북도\s/, "경북 ")
    .replace(/^경상남도\s/, "경남 ");
}

export interface NearbyDiary {
  id: number;
  datetime: string; // ISO string
  emotion: string; // "happy" | "sad" | ...
  location: {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
  };
  thumbnailUrl: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  position: { lat: number; lng: number; address?: string } | null;
  /** 썸네일 클릭 시 상세 화면으로 라우팅 등 할 때 사용 (선택) */
  onClickDiary?: (diaryId: number) => void;
}

async function fetchDiariesByLocation(position: {
  lat: number;
  lng: number;
  address?: string;
}): Promise<NearbyDiary[]> {
  try {
    // 주소 정보가 없으면 현재 위치에 대한 일기 목록을 표시하지 않음
    if (!position.address) {
      return [];
    }

    const API_BASE_URL = "https://modidiary.store/api";
    const { data } = await axios.get(`${API_BASE_URL}/diaries/nearby`, {
      params: {
        swLat: 37.0, // 한국 전체 영역
        swLng: 126.0,
        neLat: 38.0,
        neLng: 130.0,
      },
      withCredentials: true,
    });

    // 같은 주소(도/시/구/동) 기준 필터 (address 전달 시)
    if (Array.isArray(data)) {
      const list = data as any[];
      const addr = position.address;
      if (addr) {
        const normalizedAddr = normalizeAddress(addr);
        console.log("=== 주소 매칭 디버깅 ===");
        console.log("마커에서 넘어온 주소:", addr);
        console.log("정규화된 마커 주소:", normalizedAddr);
        console.log("API 응답 개수:", list.length);

        const filtered = list.filter((diary) => {
          const diaryAddr = diary.location?.address;
          if (!diaryAddr) return false;
          const normalizedDiaryAddr = normalizeAddress(diaryAddr);
          console.log("API 일기 주소:", diaryAddr);
          console.log("정규화된 일기 주소:", normalizedDiaryAddr);
          console.log("매칭 결과:", normalizedDiaryAddr === normalizedAddr);
          return normalizedDiaryAddr === normalizedAddr;
        });

        console.log("필터링 후 개수:", filtered.length);
        console.log("=== 디버깅 끝 ===");
        return filtered;
      }
      return []; // 주소 정보가 없으면 전체를 노출하지 않음
    }

    return [];
  } catch (error) {
    console.error("위치별 일기 조회 실패:", error);
    return [];
  }
}

function dayKey(iso: string) {
  const d = new Date(iso);
  const yy = d.getFullYear().toString().slice(2);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${yy}. ${m}. ${day}`;
}

const EMO_KO: Record<string, string> = {
  happy: "기쁨",
  sad: "슬픔",
  excited: "신남",
  angry: "화남",
  bored: "지루함",
  love: "사랑",
  surprised: "놀람",
  sick: "아픔",
  nervous: "떨림",
  normal: "보통",
};

export default function LocationDiariesBottomSheet({
  isOpen,
  onClose,
  position,
  onClickDiary,
}: Props) {
  const [items, setItems] = useState<NearbyDiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !position) return;
    setLoading(true);
    setErr(null);
    fetchDiariesByLocation(position)
      .then(setItems)
      .catch((e) => setErr(e?.message ?? "목록을 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [isOpen, position]);

  const title = useMemo(() => {
    if (!items.length) return "이 위치의 일기";
    // 같은 위치이므로 첫 항목 주소 표시
    return items[0]?.location?.address ?? "이 위치의 일기";
  }, [items]);

  const grouped = useMemo(() => {
    const map = new Map<string, NearbyDiary[]>();
    for (const d of items) {
      const key = dayKey(d.datetime);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).sort(
      (a, b) =>
        new Date(b[1][0].datetime).getTime() -
        new Date(a[1][0].datetime).getTime()
    );
  }, [items]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} minimizeOnDrag>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.bar} />
        </div>

        {loading && (
          <div className={styles.state}>
            <div className={styles.spinner} />
            <span>불러오는 중…</span>
          </div>
        )}

        {!loading && err && (
          <div className={styles.state}>
            <span className={styles.error}>{err}</span>
          </div>
        )}

        {!loading && !err && items.length === 0 && (
          <div className={styles.state}>
            <span>이 위치에는 아직 일기가 없어요.</span>
          </div>
        )}

        {!loading && !err && !!grouped.length && (
          <div className={styles.sections}>
            {grouped.map(([day, arr]) => {
              const latestThree = [...arr]
                .sort(
                  (a, b) =>
                    new Date(b.datetime).getTime() -
                    new Date(a.datetime).getTime()
                )
                .slice(0, 3);

              return (
                <section key={day} className={styles.section}>
                  <div className={styles.day}>{day}</div>
                  <div className={styles.grid}>
                    {latestThree.map((d) => (
                      <button
                        key={d.id}
                        className={styles.card}
                        onClick={() => {
                          console.log("일기 클릭:", d.id);
                          onClickDiary?.(d.id);
                        }}
                      >
                        <img
                          className={styles.thumb}
                          src={d.thumbnailUrl}
                          alt=""
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
