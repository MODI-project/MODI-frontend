export interface DiaryDraft {
  emotion: string | null;
  address: string;
  dong: string;
  keywords: string[];
  content: string;
  image: string | null;
  summary: string;
  tone: string;
  templateId: number;
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
  summary: "",
  tone: "",
  templateId: 0,
};
