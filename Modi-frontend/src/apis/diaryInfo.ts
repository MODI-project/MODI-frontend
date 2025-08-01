import { DiaryData } from "../components/common/frame/Frame";
import axios from "axios";
export type { DiaryData };

const API_BASE_URL =
  import.meta.env.VITE_API_ENV || "http://localhost:5173/api";

// 실제 서버 API 응답 타입
interface DiariesResponse {
  diaries: DiaryData[];
}

// 일기 목록 조회 (GET /api/diaries)
export const fetchDiaries = async (): Promise<DiaryData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/diaries`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    const result: DiariesResponse = response.data;
    return result.diaries || [];
  } catch (error) {
    console.error("일기 목록 조회 실패:", error);
    // 개발 중에는 목업 데이터 반환
    return mockDiaries;
  }
};

// 특정 일기 조회 (현재는 목업 데이터만 사용)
export const fetchDiaryById = async (id: string): Promise<DiaryData> => {
  try {
    // 실제 API가 구현되면 여기서 서버 호출
    // const response = await axios.get(`${API_BASE_URL}/diaries/${id}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     "Content-Type": "application/json",
    //   },
    // });
    // return response.data;

    // 현재는 목업 데이터 사용
    return mockFetchDiaryById(id);
  } catch (error) {
    console.error("일기 조회 실패:", error);
    throw error;
  }
};

// 일기 생성 (POST /api/diaries) - 현재는 목업 데이터만 사용
export const createDiary = async (
  diaryData: Omit<DiaryData, "id" | "photoUrl">,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    // 실제 API 구현 시 사용할 코드
    // const formData = new FormData();
    // if (imageFile) {
    //   formData.append("file", imageFile);
    // }
    // formData.append("data", JSON.stringify(diaryData));
    // const response = await axios.post(`${API_BASE_URL}/diaries`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    // return response.data;

    // 현재는 목업 데이터 반환
    return mockCreateDiary(diaryData);
  } catch (error) {
    console.error("일기 생성 실패:", error);
    throw error;
  }
};

// 일기 수정 (PUT /api/diaries/{id}) - 현재는 목업 데이터만 사용
export const updateDiary = async (
  id: string,
  diaryData: Partial<DiaryData>,
  imageFile?: File
): Promise<DiaryData> => {
  try {
    // 실제 API 구현 시 사용할 코드
    // const formData = new FormData();
    // if (imageFile) {
    //   formData.append("file", imageFile);
    // }
    // formData.append("data", JSON.stringify(diaryData));
    // const response = await axios.put(`${API_BASE_URL}/diaries/${id}`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    // return response.data;

    // 현재는 목업 데이터 반환
    const existingDiary = mockDiaries.find((d) => d.id === parseInt(id));
    if (!existingDiary) {
      throw new Error("일기를 찾을 수 없습니다.");
    }
    return { ...existingDiary, ...diaryData };
  } catch (error) {
    console.error("일기 수정 실패:", error);
    throw error;
  }
};

// 일기 삭제 (DELETE /api/diaries/{id}) - 현재는 목업 데이터만 사용
export const deleteDiary = async (id: string): Promise<void> => {
  try {
    // 실제 API 구현 시 사용할 코드
    // await axios.delete(`${API_BASE_URL}/diaries/${id}`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    console.log(`목업: 일기 ${id} 삭제됨`);
  } catch (error) {
    console.error("일기 삭제 실패:", error);
    throw error;
  }
};

// Mock 데이터 (개발용) - 새로운 명세서에 맞게 수정
export const mockDiaries: DiaryData[] = [
  {
    id: 8,
    date: "2025-07-26",
    photoUrl:
      "https://cdn.pixabay.com/photo/2019/09/09/05/14/seoul-4462638_1280.jpg",
    summary: "맑은 날 친구와 산책하며 즐거운 시간을 보낸 하루",
    emotion: "기쁨",
    tags: ["야호", "토론"],
    // 추가 필드들 (기본값)
    content: "오늘은 날씨가 좋아서 여자친구랑 산책을 했다. 기분이 정말 좋았다!",
    address: "서울특별시 용산구 한강로동",
    latitude: 37.111111,
    longitude: 127.111111,
    tone: "행복",
    font: "NanumSquareNeo",
    frame: "11",
  },
  {
    id: 14,
    date: "2025-07-29",
    photoUrl:
      "https://cdn.pixabay.com/photo/2018/10/06/11/22/coffee-3727673_1280.jpg",
    summary: "새로운 카페 탐방의 즐거움을 느낀 하루",
    emotion: "슬픔",
    tags: ["야호", "와하"],
    // 추가 필드들 (기본값)
    content: "새로운 카페를 발견했다. 분위기가 정말 좋고 커피도 맛있었다.",
    address: "서울특별시 강남구 역삼동",
    latitude: 37.222222,
    longitude: 127.222222,
    tone: "즐거움",
    font: "NanumSquareNeo",
    frame: "2",
  },
  {
    id: 15,
    date: "2025-08-01",
    photoUrl:
      "https://media.istockphoto.com/id/1337257093/ko/%EC%82%AC%EC%A7%84/%ED%96%89%EB%B3%B5%ED%95%9C-%EC%A0%8A%EC%9D%80-%EB%B6%80%EB%B6%80-%EC%99%80-%ED%92%8D%EC%84%A0-%EB%8F%84%EB%84%9B-%EC%97%90-%EB%B0%94%EB%8B%A4-%ED%95%B4%EB%B3%80.jpg?s=2048x2048&w=is&k=20&c=GBQgx_dDUIbwZ2FWBWsM3fmykEp6CmxLFyGWDHrYLvo=",
    summary: "한여름에는 즐거운 물놀이!",
    emotion: "신남",
    tags: ["시원함", "행복", "청춘", "추억"],
    // 추가 필드들 (기본값)
    content: "한여름에는 즐거운 물놀이!",
    address: "인천광역시 중구 을왕동",
    latitude: 37.44637098924813,
    longitude: 126.37234085890937,
    tone: "즐거움",
    font: "NanumSquareNeo",
    frame: "12",
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
      const diary = mockDiaries.find((d) => d.id === parseInt(id));
      if (diary) {
        resolve(diary);
      } else {
        reject(new Error("일기를 찾을 수 없습니다."));
      }
    }, 300);
  });
};

export const mockCreateDiary = async (
  diaryData: Omit<DiaryData, "id" | "photoUrl">
): Promise<DiaryData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDiary: DiaryData = {
        ...diaryData,
        id: Date.now(),
        photoUrl:
          "https://chaebucket1.s3.ap-northeast-2.amazonaws.com/new-diary.jpg",
      };
      resolve(newDiary);
    }, 1000);
  });
};
