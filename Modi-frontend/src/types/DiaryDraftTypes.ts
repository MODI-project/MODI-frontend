// types/DiaryDraftTypes.ts
export interface DiaryDraft {
  mode: "create" | "edit";
  diaryId?: number;
  emotion: string | null;
  address: string;
  dong: string;
  keywords: string[];
  content: string;
  image: string | null;
  imageChanged?: boolean;
  imageFile?: File;
  summary: string;
  tone: string;
  templateId: number | null;
  font: string;
  noEmotionSummary: string;
  latitude?: number;
  longitude?: number;
  style?: string;
  date?: string;
}

export const defaultDraft: DiaryDraft = {
  mode: "create",
  emotion: null,
  address: "",
  dong: "",
  keywords: [],
  content: "",
  image: null,
  imageFile: undefined,
  imageChanged: false,
  summary: "",
  tone: "",
  templateId: null,
  font: "",
  noEmotionSummary: "",
  latitude: undefined,
  longitude: undefined,
  style: "",
  date: undefined,
};
