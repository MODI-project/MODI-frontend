import axios from "axios";

export interface ReminderDiaryItem {
  id: number;
  datetime: string; // 가장 최근 기록일
  thumbnailUrl?: string | null;
  created_at?: string; // 알림 생성 시각(옵션)
}

/**
 * GET /api/reminders?address={address}
 * 주소(동 포함)로 해당 지역의 일기 목록을 반환한다.
 * address는 한글 주소 문자열 그대로 넘기면 axios가 자동 인코딩한다.
 */
export async function getRemindersByAddress(
  address: string
): Promise<ReminderDiaryItem[]> {
  const { data } = await axios.get<ReminderDiaryItem[]>("/reminders", {
    params: { address },
  });
  return Array.isArray(data) ? data : [];
}
