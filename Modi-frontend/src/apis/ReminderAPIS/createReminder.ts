import apiClient from "../apiClient";
import { ReminderResponse } from "../../types/Reminder";

export interface CreateReminderRequest {
  address: string;
}

/**
 * 주소(동 기준)로 해당 지역의 다이어리를 스캔하여 알림 객체를 생성 및 반환합니다.
 * @param payload - 알림 생성 요청 데이터 (address: 동 단위 주소 문자열)
 * @returns 생성된 알림 객체
 * @throws {AxiosError} 400 - 주소는 필수 입력값입니다 / 시작 시각은 종료 시각보다 앞서야 합니다
 * @throws {AxiosError} 500 - 서버 내부 오류가 발생했습니다
 */
export const createReminder = async (
  payload: CreateReminderRequest
): Promise<ReminderResponse> => {
  try {
    const response = await apiClient.post<ReminderResponse>(
      "/reminders",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("알림 생성 실패:", error);
    throw error;
  }
};
