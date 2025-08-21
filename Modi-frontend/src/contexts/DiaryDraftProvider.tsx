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
    // 좌표 변경 시 로그 출력
    if (fields.latitude !== undefined || fields.longitude !== undefined) {
      console.log("=== Draft 좌표 변경 ===");
      console.log("변경된 필드:", fields);
      console.log("이전 좌표:", { latitude: draft.latitude, longitude: draft.longitude });
      console.log("새 좌표:", { 
        latitude: fields.latitude ?? draft.latitude, 
        longitude: fields.longitude ?? draft.longitude 
      });
      console.log("=== Draft 좌표 변경 끝 ===");
    }
    
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
