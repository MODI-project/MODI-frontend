import { DiaryData } from "../components/common/frame/Frame";
import axios from "axios";
export type { DiaryData };

const API_BASE_URL = "https://modidiary.store/api";

// 실제 서버 API 응답 타입
interface DiariesResponse {
  diaries: DiaryData[];
}

// 일기 목록 조회 (GET /api/diaries)
export const fetchDiaries = async (): Promise<DiaryData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diaries`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: DiariesResponse = response.data;
    return result.diaries || [];
  } catch (error) {
    console.error("일기 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 일기 조회
export const fetchDiaryById = async (id: string): Promise<DiaryData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diaries/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("일기 조회 실패:", error);
    throw error;
  }
};

// 일기 생성 (POST /api/diaries)
export const createDiary = async (
  diaryData: Omit<DiaryData, "id" | "photoUrl">,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }
    formData.append("data", JSON.stringify(diaryData));
    const response = await axios.post(`${API_BASE_URL}/diaries`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("일기 생성 실패:", error);
    throw error;
  }
};

// 일기 수정 (PUT /api/diaries/{id})
export const updateDiary = async (
  id: string,
  diaryData: Partial<DiaryData>,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }
    formData.append("data", JSON.stringify(diaryData));
    const response = await axios.put(
      `${API_BASE_URL}/diaries/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("일기 수정 실패:", error);
    throw error;
  }
};

// 일기 삭제 (DELETE /api/diaries/{id})
export const deleteDiary = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/diaries/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("일기 삭제 실패:", error);
    throw error;
  }
};

// 지도 뷰포트 기반 일기 목록 조회 (GET /api/diaries/nearby)
export const fetchDiariesByViewport = async (
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number
): Promise<DiaryData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diaries/nearby`, {
      params: {
        swLat,
        swLng,
        neLat,
        neLng,
      },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 서버 응답 구조에 따라 다르게 처리
    if (response.data.diaries) {
      // 기존 구조: { diaries: [...] }
      const result: DiariesResponse = response.data;
      console.log("=== 서버에서 받아온 일기 데이터 ===");
      result.diaries.forEach((diary, index) => {
        console.log(`일기 ${index + 1}:`, {
          id: diary.id,
          address: diary.address,
          latitude: diary.latitude,
          longitude: diary.longitude,
        });
      });
      console.log("=== 서버 데이터 끝 ===");
      return result.diaries || [];
    } else if (Array.isArray(response.data)) {
      // 직접 배열로 반환되는 경우
      console.log("=== 서버에서 받아온 일기 데이터 (배열) ===");
      response.data.forEach((diary, index) => {
        console.log(`일기 ${index + 1}:`, {
          id: diary.id,
          address: diary.address,
          latitude: diary.latitude,
          longitude: diary.longitude,
        });
      });
      console.log("=== 서버 데이터 끝 ===");
      return response.data;
    } else {
      // 다른 구조인 경우
      console.log("알 수 없는 응답 구조:", response.data);
      return [];
    }
  } catch (error) {
    console.error("뷰포트 기반 일기 목록 조회 실패:", error);
    throw error;
  }
};
