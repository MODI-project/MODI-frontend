import axios from "axios";

// 서버 엔드포인트가 준비되지 않았을 수 있으므로
// 환경변수로 URL이 주어졌을 때만 네트워크 요청을 수행한다.
// 없으면 프론트에서 조용히 스킵한다.
const REMINDER_ENTER_URL = import.meta.env.VITE_NOTIFY_ENTER_URL || ""; // 예: https://modidiary.store/api/reminders/enter

export interface EnterNotifyPayload {
  dong: string;
  lat?: number;
  lon?: number;
  daysSince?: number;
}

// 서버에 동 진입 이벤트를 기록(엔드포인트는 필요에 따라 변경)
export async function notifyEnter(payload: EnterNotifyPayload) {
  if (!REMINDER_ENTER_URL) {
    console.info("[notifyEnter] no endpoint configured - skipped", payload);
    return null; // 네트워크 호출 없이 종료
  }
  try {
    const { data } = await axios.post(REMINDER_ENTER_URL, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    console.warn("[notifyEnter] failed:", e);
    return null;
  }
}
