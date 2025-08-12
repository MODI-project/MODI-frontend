import apiClient from "../apiClient";
import type { DiaryDraft } from "../../types/DiaryDraftTypes";

export interface PostDiaryResponse {
  message: string;
}

function toLocalDateTimeString(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** 파일 사이즈를 보기 좋게 */
const pretty = (n: number) =>
  n > 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(2)} MB`
    : `${(n / 1024).toFixed(0)} KB`;

/** 이미지 목표 용량 이하가 될 때까지 반복 압축 (JPEG) */
async function compressToTarget(
  file: File,
  targetBytes = 900 * 1024 // ≈ 0.9MB
): Promise<File> {
  if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) return file;

  let current = file;
  if (current.size <= targetBytes) return current;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = URL.createObjectURL(current);
  });

  const steps = [
    { w: 1600, q: 0.8 },
    { w: 1280, q: 0.72 },
    { w: 1024, q: 0.65 },
    { w: 800, q: 0.58 },
  ];

  for (const s of steps) {
    const scale = Math.min(1, s.w / img.naturalWidth);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.drawImage(img, 0, 0, w, h);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", s.q)
    );
    if (!blob) break;

    const newFile = new File([blob], current.name.replace(/\.\w+$/, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
    current = newFile;
    if (current.size <= targetBytes) break;
  }
  return current;
}

/** UI 영문 슬러그 -> 서버 한글 값 매핑 */
const EMOTION_EN_TO_KO: Record<string, string> = {
  happy: "기쁨",
  surprised: "놀람",
  nervous: "긴장",
  normal: "보통",
  love: "사랑",
  excited: "신남",
  sad: "슬픔",
  sick: "아픔",
  bored: "지루함",
  angry: "화남",
};

export async function postDiary(
  draft: DiaryDraft,
  date: Date | string = new Date()
): Promise<PostDiaryResponse> {
  // 감정값을 서버 스펙(한글)로 변환
  const emotionForServer =
    (draft.emotion && EMOTION_EN_TO_KO[draft.emotion]) || draft.emotion || "";

  const data = {
    content: String(draft.content ?? ""),
    summary: String(draft.summary ?? ""),
    date: toLocalDateTimeString(date), // e.g. 2025-07-28T15:30:00
    address: String(draft.address ?? ""),
    latitude: Number(draft.latitude ?? 0),
    longitude: Number(draft.longitude ?? 0),
    emotion: String(emotionForServer), // ✅ 한글로 전송
    tone: String(draft.tone ?? ""),
    tags: Array.isArray(draft.keywords) ? draft.keywords.map(String) : [],
    font: String(draft.font ?? ""),
    frame: draft.templateId != null ? String(draft.templateId) : "", // 문서 예시대로 문자열
  };

  const form = new FormData();
  // ✅ data 파트를 application/json 으로 명시
  form.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (draft.imageFile) {
    console.log(
      "원본 이미지 크기:",
      pretty(draft.imageFile.size),
      draft.imageFile.type
    );
    const imageToSend = await compressToTarget(draft.imageFile, 900 * 1024);
    console.log(
      "압축 후 이미지 크기:",
      pretty(imageToSend.size),
      imageToSend.type
    );
    form.append("image", imageToSend);
  }

  const res = await apiClient.post<PostDiaryResponse>("/diaries", form, {
    // @ts-ignore
    maxBodyLength: Infinity,
    // @ts-ignore
    maxContentLength: Infinity,
  });
  return res.data;
}
