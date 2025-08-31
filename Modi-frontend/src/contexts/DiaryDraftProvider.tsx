import React, { useState } from "react";
import { DiaryDraft } from "../types/DiaryDraftTypes";
import { defaultDraft } from "../types/DiaryDraftTypes";
import { DiaryDraftContext } from "./DiaryDraftContext";

export const DiaryDraftProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [draft, setDraftState] = useState<DiaryDraft>(defaultDraft);

  const setDraft = (fields: Partial<DiaryDraft>) => {
    setDraftState((prev) => ({ ...prev, ...fields }));
  };

  const resetDraft = () => {
    setDraftState(defaultDraft);
  };

  return (
    <DiaryDraftContext.Provider value={{ draft, setDraft, resetDraft }}>
      {children}
    </DiaryDraftContext.Provider>
  );
};
