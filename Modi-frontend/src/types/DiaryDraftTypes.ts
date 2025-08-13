export interface DiaryDraftContextType {
  draft: DiaryDraft;
  setDraft: (updates: Partial<DiaryDraft>) => void;
  resetDraft: () => void;
}

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
  originalContent?: string;
  originalAddress?: string;
  originalKeywords?: string[];
  originalImage?: string | null;
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
  originalContent: "",
  originalAddress: "",
  originalKeywords: [],
  originalImage: null,
};
