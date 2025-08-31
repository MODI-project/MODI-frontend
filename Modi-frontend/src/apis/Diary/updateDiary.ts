// src/apis/Diary/updateDiary.ts
import apiClient from "../apiClient";
import type { DiaryDraft } from "../../types/DiaryDraftTypes";
import { compressImage } from "../../utils/compressImage";

function toLocalDateTimeISO(date?: string) {
  const d = date ? new Date(date) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export async function updateDiary(diaryId: number, draft: DiaryDraft) {
  // 필요하면 기존 값 보강
  let exist: any = null;
  try {
    const res = await apiClient.get(`/diaries/${diaryId}`);
    exist = res.data;
  } catch {
    /* noop */
  }

  const payload = {
    content: draft.content ?? exist?.content ?? "",
    summary: draft.summary ?? draft.noEmotionSummary ?? exist?.summary ?? "",
    date: toLocalDateTimeISO(exist?.date),
    address: draft.address ?? exist?.location?.address ?? "",
    latitude: draft.latitude ?? exist?.location?.latitude ?? undefined,
    longitude: draft.longitude ?? exist?.location?.longitude ?? undefined,
    emotion: draft.emotion ?? exist?.emotion?.name ?? "",
    tone: draft.tone ?? exist?.tone ?? "",
    tags: (draft.keywords?.length
      ? draft.keywords
      : (exist?.tags || exist?.keywords || [])
          .map((t: any) => (typeof t === "string" ? t : t?.name))
          .filter(Boolean)) as string[],
    font: draft.font ?? exist?.font ?? "",
    frame: String(draft.templateId ?? exist?.frame ?? exist?.frameId ?? 1),
  };

  // 공통 FormData 생성
  const makeForm = async (withImage: boolean) => {
    const form = new FormData();

    // ★★★ data는 JSON Blob으로(서버가 application/json 파트를 기대함)
    const jsonBlob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    form.append("data", jsonBlob);

    if (withImage && draft.imageChanged && draft.imageFile instanceof File) {
      let fileToSend = draft.imageFile;
      try {
        fileToSend = await compressImage(draft.imageFile, 1600, 0.82);
      } catch {
        /* 압축 실패 시 원본 전송 */
      }
      // 파일명까지 명시
      form.append("image", fileToSend, fileToSend.name);
    }

    return form;
  };

  // axios 인스턴스에 기본 JSON 헤더가 걸려 있어도, 이 요청만큼은 멀티파트로 강제
  const mpHeaders = { "Content-Type": "multipart/form-data" as const };

  try {
    const formWithImage = await makeForm(true);
    const { data } = await apiClient.put(`/diaries/${diaryId}`, formWithImage, {
      headers: mpHeaders,
    });
    return data;
  } catch (err: any) {
    const status = err?.response?.status;

    // 413이면 이미지 없이 재시도
    if (status === 413) {
      try {
        const formNoImage = await makeForm(false);
        const { data } = await apiClient.put(
          `/diaries/${diaryId}`,
          formNoImage,
          { headers: mpHeaders }
        );
        console.warn("[updateDiary] 413 -> 이미지 없이 재시도 성공");
        return data;
      } catch (e2) {
        console.error("[updateDiary] retry without image failed:", e2);
        throw e2;
      }
    }

    // 415면 거의 확실히 data를 문자열로 보냈거나 헤더가 JSON이었던 케이스
    if (status === 415) {
      console.error(
        "[updateDiary] 415 Unsupported Media Type - data를 JSON Blob으로 보내고, 헤더는 multipart/form-data인지 확인하세요."
      );
    }

    throw err;
  }
}
