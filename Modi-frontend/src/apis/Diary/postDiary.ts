// apis/Diary/postDiary.ts
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

/**
 * 목표 용량 이하가 될 때까지 반복 압축 (JPEG)
 * - 초기: maxWidth=1600, quality=0.8
 * - 부족하면 width와 quality 점진 하향
 */
async function compressToTarget(
  file: File,
  targetBytes = 900 * 1024 // ≈ 0.9MB
): Promise<File> {
  // 브라우저에서 바로 다루기 힘든 포맷(예: HEIC)은 안내하고 원본 반환
  if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
    console.warn("지원하지 않는 이미지 타입(브라우저 변환 어려움):", file.type);
    alert(
      "지원하지 않는 이미지 형식입니다. JPG/PNG로 촬영/변환 후 다시 시도해주세요."
    );
    return file;
  }

  let current = file;

  // 사이즈가 이미 작으면 스킵
  if (current.size <= targetBytes) return current;

  // 이미지 로드
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = URL.createObjectURL(current);
  });

  // 압축 파라미터
  let maxWidth = 1600; // 1600 → 1280 → 1024 → 800
  let quality = 0.8; // 0.8 → 0.72 → 0.65 → 0.58
  const steps = [
    { w: 1600, q: 0.8 },
    { w: 1280, q: 0.72 },
    { w: 1024, q: 0.65 },
    { w: 800, q: 0.58 },
  ];

  for (const s of steps) {
    maxWidth = s.w;
    quality = s.q;

    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;

    ctx.drawImage(img, 0, 0, w, h);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
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

export async function postDiary(
  draft: DiaryDraft,
  date: Date | string = new Date()
): Promise<PostDiaryResponse> {
  const form = new FormData();

  const data = {
    content: draft.content,
    summary: draft.summary,
    date: toLocalDateTimeString(date),
    address: draft.address,
    latitude: draft.latitude ?? 0,
    longitude: draft.longitude ?? 0,
    emotion: draft.emotion ?? "",
    tone: draft.tone,
    tags: draft.keywords, // keywords -> tags
    font: draft.font,
    frame: draft.templateId ? String(draft.templateId) : "",
  };

  form.append("data", JSON.stringify(data));

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
    // 브라우저에선 보통 의미 없지만 혹시 모르니 추가
    // @ts-ignore
    maxBodyLength: Infinity,
    // @ts-ignore
    maxContentLength: Infinity,
  });

  return res.data;
}
