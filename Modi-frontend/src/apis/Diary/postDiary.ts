// apis/Diary/postDiary.ts
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

  let imageToSend: File | undefined;
  if (draft.imageFile) {
    imageToSend = await compressToTarget(draft.imageFile, 900 * 1024);
    form.append("image", imageToSend);
  }

  // 🔎 개발환경에서만 깔끔한 디버그 로그
  if (import.meta.env.MODE !== "production") {
    const entries: Array<[string, unknown]> = [];
    form.forEach((value, key) => {
      if (value instanceof File) {
        entries.push([
          key,
          {
            kind: "File",
            name: value.name,
            type: value.type,
            sizeKB: Math.round(value.size / 1024),
          },
        ]);
      } else {
        entries.push([key, value]);
      }
    });

    if (draft.imageFile) {
      console.table(
        [
          {
            label: "original",
            name: draft.imageFile.name,
            type: draft.imageFile.type,
            sizeKB: Math.round(draft.imageFile.size / 1024),
          },
          imageToSend && {
            label: "compressed",
            name: imageToSend.name,
            type: imageToSend.type,
            sizeKB: Math.round(imageToSend.size / 1024),
          },
        ].filter(Boolean)
      );
    }
    console.table(entries);
    console.groupEnd();
  }

  const res = await apiClient.post<PostDiaryResponse>("/diaries", form, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  // 🔎 응답 로그도 보기 좋게
  if (import.meta.env.MODE !== "production") {
    console.groupCollapsed("✅ [POST /diaries] Response");
    console.log("서버 응답:", res.data);
    console.groupEnd();
  }

  return res.data;
}
