import { Emotion } from "../components/HomePage/EmotionTab/EmotionTab";

export interface Diary {
  id: number;
  date: string; // "YYYY-MM-DD"
  photoUrl: string;
  emotion: Emotion; // "기쁨" | "슬픔" | …
}

// 임시 더미 데이터
export const allDiaries: Diary[] = [
  { id: 1, date: "2025-07-10", photoUrl: "/img/1.jpg", emotion: "기쁨" },
  { id: 2, date: "2025-07-10", photoUrl: "/img/2.jpg", emotion: "슬픔" },
  { id: 3, date: "2025-06-15", photoUrl: "/img/3.jpg", emotion: "보통" },
  // …필요한 만큼 추가
];

//API 연동시 변경
