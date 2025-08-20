import { useEffect, useMemo, useState } from "react";
import BottomSheet from "../../common/BottomSheet";
import styles from "./LocationDiariesBottomSheet.module.css";
import axios from "axios";
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
        return list.filter((diary) => diary.location?.address === addr);
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
