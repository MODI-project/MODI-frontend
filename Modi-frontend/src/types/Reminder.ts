export interface WeeklyReminderResponse {
  id: number;
  created_at: string;
  address: string;
  lastVisit: string;
  emotion: string;
}

/**
 * 알림 생성 API 응답 타입
 * 알림 정보를 저장하기 위해 서버에서 내부적으로 생성하는 객체
 */
export interface ReminderResponse {
  id: number;
  created_at: string; // 알림 생성 일시
  address: string;
  lastVisit: string; // 가장 최근 기록 일시
  emotion: string; // 가장 최근 기록의 감정
}
