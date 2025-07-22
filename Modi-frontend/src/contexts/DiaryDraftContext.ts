import { createContext } from "react";
import { DiaryDraftContextType, defaultDraft } from "../types/DiaryDraftTypes";
export { DiaryDraftProvider } from "./DiaryDraftProvider";
export const DiaryDraftContext = createContext<DiaryDraftContextType>({
  draft: defaultDraft,
  setDraft: () => {},
  resetDraft: () => {},
});
