export interface DiaryDraft {
  emotion: string | null;
  address: string;
  dong: string;
  keywords: string[];
  content: string;
  image: string | null;
  imageFile?: File;
  summary: string;
  tone: string;
  templateId: number | null;
  font: string;
  noEmotionSummary: string;
  latitude?: number;
  longitude?: number;
}

export interface DiaryDraftContextType {
  draft: DiaryDraft;
  setDraft: (fields: Partial<DiaryDraft>) => void;
  resetDraft: () => void;
}

export const defaultDraft: DiaryDraft = {
  emotion: null,
  address: "",
  dong: "",
  keywords: [],
  content: "",
  image: null,
  imageFile: undefined,
  summary: "",
  tone: "",
  templateId: null,
  font: "",
  noEmotionSummary: "",
  latitude: undefined,
  longitude: undefined,
};
