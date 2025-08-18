import axios from "axios";
import { reverseToDong } from "../MapAPIS/reverseGeocode";

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
  address?: string
): Promise<ReminderDiaryItem[]> {
  let targetAddress = address;

  // address가 제공되지 않으면 현재 위치의 주소를 가져옴
  if (!targetAddress) {
    try {
      // 현재 위치 가져오기
      const position = await getCurrentPosition();
      const geocodeResult = await reverseToDong(position.lat, position.lon);

      if (geocodeResult?.fullAddress) {
        targetAddress = geocodeResult.fullAddress;
        console.log("현재 위치 주소로 리마인더 조회:", targetAddress);
      } else if (geocodeResult?.dong) {
        targetAddress = geocodeResult.dong;
        console.log("현재 동으로 리마인더 조회:", targetAddress);
      } else {
        console.warn("현재 위치 주소를 가져올 수 없습니다.");
        return [];
      }
    } catch (error) {
      console.error("현재 위치 가져오기 실패:", error);
      return [];
    }
  }

  const { data } = await axios.get<ReminderDiaryItem[]>("/reminders", {
    params: { address: targetAddress },
  });
  return Array.isArray(data) ? data : [];
}

// 현재 위치를 가져오는 헬퍼 함수
function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation이 지원되지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
