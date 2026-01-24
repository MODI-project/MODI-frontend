import apiClient from "../apiClient";
import type { AxiosError } from "axios";

export interface ReminderDiaryItem {
  id: number;
  datetime: string; // ISO string, e.g., "2023-10-26T10:00:00"
  thumbnailUrl?: string;
  created_at?: string; // Fallback for datetime if needed
  emotion?: string; // Added based on NotificationItem needs
  address?: string; // Added based on NotificationItem needs
}

export interface RemindersByAddressResponse {
  items: ReminderDiaryItem[];
  nextCursor: string | null;
}

export interface RemindersApiErrorBody {
  message: string;
  status: number;
}

export type RemindersByAddressParams = {
  address: string;
  limit: number;
  cursor?: string | null;
};

/**
 * GET /api/reminders?address={address}&limit={limit}&cursor={cursor}
 *
 * - baseURL이 이미 `/api`를 포함하므로 여기서는 `/reminders`로 호출합니다.
 * - cursor가 없으면 첫 페이지를 조회합니다.
 * - 에러 응답은 { message, status } 형태로 throw 합니다.
 */
export async function getRemindersByAddressPage(
  params: RemindersByAddressParams
): Promise<RemindersByAddressResponse> {
  try {
    const response = await apiClient.get<RemindersByAddressResponse>("/reminders", {
      params: {
        address: params.address, // axios가 자동으로 인코딩
        limit: params.limit,
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    });

    // 방어: 백엔드가 items만 주거나 형태가 바뀌어도 UI가 깨지지 않게
    const data = response.data as Partial<RemindersByAddressResponse>;
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
}

/**
 * (기존 호환) 주소로 전체 목록을 반환하던 형태를 유지합니다.
 * 커서 기반 페이지네이션 도입 전 호출부가 깨지지 않게 items만 리턴합니다.
 */
export async function getRemindersByAddress(
  address: string
): Promise<ReminderDiaryItem[]> {
  try {
    const { items } = await getRemindersByAddressPage({ address, limit: 20 });
    return items;
  } catch (error) {
    console.error(
      `[getRemindersByAddress] Failed to fetch reminders for ${address}:`,
      error
    );
    return [];
  }
}
