export type Emotion =
  | "기쁨"
  | "놀람"
  | "보통"
  | "떨림"
  | "사랑"
  | "신남"
  | "아픔"
  | "슬픔"
  | "지루함"
  | "화남";

export interface Diary {
  id: number;
  date: string; // "YYYY-MM-DD"
  photoUrl: string;
  summary: string;
  emotion: Emotion;
  tags?: string[];
}

// 임시 더미 데이터
export const allDiaries: Diary[] = [
  {
    id: 1,
    date: "2025-07-10",
    photoUrl: "/img/1.jpg",
    summary: "",
    emotion: "기쁨",
  },
  {
    id: 2,
    date: "2025-07-10",
    photoUrl: "/img/2.jpg",
    summary: "",
    emotion: "슬픔",
  },
  {
    id: 3,
    date: "2025-06-15",
    photoUrl: "/img/3.jpg",
    summary: "",
    emotion: "보통",
  },
  // …필요한 만큼 추가
];

//API 연동시 변경
