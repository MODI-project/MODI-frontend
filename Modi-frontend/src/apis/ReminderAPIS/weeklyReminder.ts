import axios from "axios";
import { WeeklyReminderResponse } from "../../types/Reminder";

const API_BASE_URL = "https://modidiary.store/api";

export const getWeeklyReminder = async (): Promise<
  WeeklyReminderResponse[]
> => {
  const response = await axios.get(`${API_BASE_URL}/diaries/recent`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return response.data;
};
