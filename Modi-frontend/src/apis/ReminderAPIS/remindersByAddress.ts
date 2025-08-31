import apiClient from "../apiClient";

export interface ReminderDiaryItem {
  id: number;
  datetime: string; // ISO string, e.g., "2023-10-26T10:00:00"
  thumbnailUrl?: string;
  created_at?: string; // Fallback for datetime if needed
  emotion?: string; // Added based on NotificationItem needs
  address?: string; // Added based on NotificationItem needs
}

export async function getRemindersByAddress(
  address: string
): Promise<ReminderDiaryItem[]> {
  try {
    const response = await apiClient.get<ReminderDiaryItem[]>(
      `/reminders?address=${encodeURIComponent(address)}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `[getRemindersByAddress] Failed to fetch reminders for ${address}:`,
      error
    );
    return [];
  }
}
