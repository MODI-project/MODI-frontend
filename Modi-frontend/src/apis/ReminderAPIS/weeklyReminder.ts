import apiClient from "../apiClient";
import { WeeklyReminderResponse } from "../../types/Reminder";

export const getWeeklyReminder = async (): Promise<
  WeeklyReminderResponse[]
> => {
  try {
    // /reminders 엔드포인트로 변경 (다른 리마인더 API와 일관성 유지)
    const response = await apiClient.get("/reminders/recent");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("주간 리마인더 조회 실패:", error);
    // 에러 발생 시 빈 배열 반환하여 UI가 깨지지 않도록 함
    return [];
  }
};
