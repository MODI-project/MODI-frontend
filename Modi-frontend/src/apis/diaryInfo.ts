import { DiaryData } from "../components/common/frame/Frame";
import axios from "axios";
export type { DiaryData };

const API_BASE_URL =
  import.meta.env.VITE_API_ENV || "http://localhost:5173/api";

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 일기 목록 조회
export const fetchDiaries = async (): Promise<DiaryData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/diaries`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<DiaryData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("일기 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 일기 조회
export const fetchDiaryById = async (id: string): Promise<DiaryData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/diaries/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<DiaryData> = await response.json();
    return result.data!;
  } catch (error) {
    console.error("일기 조회 실패:", error);
    throw error;
  }
};

// 일기 생성 (multipart/form-data)
export const createDiary = async (
  diaryData: Omit<DiaryData, "id" | "createdAt" | "updatedAt" | "photoUrl">,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    const formData = new FormData();

    // 이미지 파일 추가
    if (imageFile) {
      formData.append("file", imageFile);
    }

    // JSON 데이터 추가
    const jsonData = {
      content: diaryData.content,
      summary: diaryData.summary,
      date: diaryData.date,
      address: diaryData.address,
      latitude: diaryData.latitude,
      longitude: diaryData.longitude,
      emotion: diaryData.emotion,
      tone: diaryData.tone,
      tags: diaryData.tags,
      font: diaryData.font,
      frameId: diaryData.frame,
    };

    formData.append("data", JSON.stringify(jsonData));

    const response = await fetch(`${API_BASE_URL}/diaries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<DiaryData> = await response.json();
    return result.data!;
  } catch (error) {
    console.error("일기 생성 실패:", error);
    throw error;
  }
};

// 일기 수정
export const updateDiary = async (
  id: string,
  diaryData: Partial<DiaryData>,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    const formData = new FormData();

    // 이미지 파일 추가
    if (imageFile) {
      formData.append("file", imageFile);
    }

    // JSON 데이터 추가
    formData.append("data", JSON.stringify(diaryData));

    const response = await fetch(`${API_BASE_URL}/diaries/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<DiaryData> = await response.json();
    return result.data!;
  } catch (error) {
    console.error("일기 수정 실패:", error);
    throw error;
  }
};

// 일기 삭제
export const deleteDiary = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/diaries/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("일기 삭제 실패:", error);
    throw error;
  }
};

// Mock 데이터 (개발용)
export const mockDiaries: DiaryData[] = [
  {
    id: "1",
    content: "오늘은 날씨가 좋아서 여자친구랑 산책을 했다. 기분이 정말 좋았다!",
    summary: "맑은 날 친구와 산책하며 즐거운 시간을 보낸 하루.",
    date: "2025-07-28T15:30:00",
    address: "서울특별시 용산구 한강로동",
    latitude: 37.111111,
    longitude: 127.111111,
    emotion: "사랑",
    tone: "행복",
    tags: ["산책", "날씨", "친구"],
    font: "NanumSquareNeo",
    frame: "11",
    photoUrl:
      "https://cdn.pixabay.com/photo/2019/09/09/05/14/seoul-4462638_1280.jpg",
  },
  {
    id: "2",
    content: "새로운 카페를 발견했다. 분위기가 정말 좋고 커피도 맛있었다.",
    summary: "새로운 카페 탐방의 즐거움을 느낀 하루.",
    date: "2025-07-27T14:20:00",
    address: "서울특별시 강남구 역삼동",
    latitude: 37.222222,
    longitude: 127.222222,
    emotion: "신남",
    tone: "즐거움",
    tags: ["카페", "커피", "새로운"],
    font: "NanumSquareNeo",
    frame: "2",
    photoUrl:
      "https://cdn.pixabay.com/photo/2018/10/06/11/22/coffee-3727673_1280.jpg",
  },
  {
    id: "3",
    content: "한여름에는 즐거운 물놀이!",
    summary: "한여름에는 즐거운 물놀이!",
    date: "2025-08-01T14:20:00",
    address: "인천광역시 중구 을왕동",
    latitude: 37.44637098924813,
    longitude: 126.37234085890937,
    emotion: "기쁨",
    tone: "즐거움",
    tags: ["물놀이", "여름", "즐거움"],
    font: "NanumSquareNeo",
    frame: "12",
    photoUrl:
      "https://media.istockphoto.com/id/1337257093/ko/%EC%82%AC%EC%A7%84/%ED%96%89%EB%B3%B5%ED%95%9C-%EC%A0%8A%EC%9D%80-%EB%B6%80%EB%B6%80-%EC%99%80-%ED%92%8D%EC%84%A0-%EB%8F%84%EB%84%9B-%EC%97%90-%EB%B0%94%EB%8B%A4-%ED%95%B4%EB%B3%80.jpg?s=2048x2048&w=is&k=20&c=GBQgx_dDUIbwZ2FWBWsM3fmykEp6CmxLFyGWDHrYLvo=",
  },
];

// Mock API 함수들 (개발용)
export const mockFetchDiaries = async (): Promise<DiaryData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDiaries);
    }, 500);
  });
};

export const mockFetchDiaryById = async (id: string): Promise<DiaryData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const diary = mockDiaries.find((d) => d.id === id);
      if (diary) {
        resolve(diary);
      } else {
        reject(new Error("일기를 찾을 수 없습니다."));
      }
    }, 300);
  });
};

export const mockCreateDiary = async (
  diaryData: Omit<DiaryData, "id" | "createdAt" | "updatedAt" | "photoUrl">
): Promise<DiaryData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDiary: DiaryData = {
        ...diaryData,
        id: Date.now().toString(),
        photoUrl: "/images/sample.jpg",
      };
      resolve(newDiary);
    }, 1000);
  });
};
