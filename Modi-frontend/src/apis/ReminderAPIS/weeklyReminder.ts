import apiClient from "../apiClient";
import { WeeklyReminderResponse } from "../../types/Reminder";
import type { AxiosError } from "axios";

export interface WeeklyReminderPageResponse {
  items: WeeklyReminderResponse[];
  nextCursor: string | null;
}

export interface RemindersApiErrorBody {
  message: string;
  status: number;
}

export type WeeklyReminderPageParams = {
  limit: number;
  cursor?: string | null;
};

/**
 * GET /api/reminders/recent?limit={limit}&cursor={cursor}
 * - baseURL이 이미 `/api`를 포함하므로 여기서는 `/reminders/recent`로 호출합니다.
 * - 응답: { items, nextCursor }
 */
export const getWeeklyReminderPage = async (
  params: WeeklyReminderPageParams
): Promise<WeeklyReminderPageResponse> => {
  try {
    const response = await apiClient.get<WeeklyReminderPageResponse>(
      "/reminders/recent",
      {
        params: {
          limit: params.limit,
          ...(params.cursor ? { cursor: params.cursor } : {}),
        },
      }
    );
    const data = response.data as Partial<WeeklyReminderPageResponse>;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      nextCursor: data.nextCursor ?? null,
    };
  } catch (e) {
    const err = e as AxiosError<RemindersApiErrorBody>;
    const body = err.response?.data;
    if (body?.message && typeof body.status === "number") {
      throw body;
    }
    throw { message: "서버 내부 오류가 발생했습니다.", status: 500 } satisfies RemindersApiErrorBody;
  }
};

/**
 * (기존 호환) 첫 페이지 items만 반환
 */
export const getWeeklyReminder = async (): Promise<WeeklyReminderResponse[]> => {
  try {
    const { items } = await getWeeklyReminderPage({ limit: 20 });
    return items;
  } catch (error) {
    console.error("주간 리마인더 조회 실패:", error);
    return [];
  }
};
