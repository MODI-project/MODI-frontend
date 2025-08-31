import { useContext } from "react";
import { DiaryDraftContext } from "../contexts/DiaryDraftContext";

export const useDiaryDraft = () => useContext(DiaryDraftContext);
