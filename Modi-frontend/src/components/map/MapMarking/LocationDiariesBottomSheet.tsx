import { useEffect, useMemo, useState } from "react";
import BottomSheet from "../../common/BottomSheet";
import styles from "./LocationDiariesBottomSheet.module.css";
import { MOCK_NEARBY_DIARIES } from "../../../apis/MapAPIS/loadMapMarkers";
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
  locationId: number | null;
  /** 썸네일 클릭 시 상세 화면으로 라우팅 등 할 때 사용 (선택) */
  onClickDiary?: (diaryId: number) => void;
}

async function fetchDiariesByLocation(
  locationId: number
): Promise<NearbyDiary[]> {
  // 개발 환경: mock
  if (import.meta.env.DEV) {
    const all = MOCK_NEARBY_DIARIES; // 아래에 정의
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(all.filter((d) => d.location.id === locationId)),
        300
      )
    );
  }
  // 실제 연동 시:
  // const { data } = await axios.get(`${API_BASE_URL}/diaries/location/${locationId}`, { withCredentials: true });
  // return data;
  return [];
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
  locationId,
  onClickDiary,
}: Props) {
  const [items, setItems] = useState<NearbyDiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !locationId) return;
    setLoading(true);
    setErr(null);
    fetchDiariesByLocation(locationId)
      .then(setItems)
      .catch((e) => setErr(e?.message ?? "목록을 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [isOpen, locationId]);

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
                        onClick={() => onClickDiary?.(d.id)}
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
