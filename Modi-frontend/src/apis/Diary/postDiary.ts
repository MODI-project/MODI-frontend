import apiClient from "../apiClient";
import type { DiaryDraft } from "../../types/DiaryDraftTypes";

export interface PostDiaryResponse {
  diaryId: number;
  message: string;
}

function toLocalDateTimeString(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

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

export async function postDiary(
  draft: DiaryDraft,
  date: Date | string = new Date()
): Promise<PostDiaryResponse> {
  const data = {
    content: String(draft.content ?? ""),
    summary: String(draft.summary ?? ""),
    date: toLocalDateTimeString(date),
    address: String(draft.address ?? ""),
    latitude: Number(draft.latitude ?? 0),
    longitude: Number(draft.longitude ?? 0),
    emotion: String(draft.emotion ?? ""),
    tone: String(draft.tone ?? ""),
    tags: Array.isArray(draft.keywords) ? draft.keywords.map(String) : [],
    font: String(draft.font ?? ""),
    frame: draft.templateId != null ? String(draft.templateId) : "",
  };

  const form = new FormData();
  form.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (draft.imageFile) {
    const imageToSend = await compressToTarget(draft.imageFile, 900 * 1024);
    form.append("image", imageToSend);
  }

  const res = await apiClient.post<PostDiaryResponse>("/diaries", form, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return res.data;
}
