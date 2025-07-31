import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type FrameType = "basic" | "character";

type BasicFrameId =
  | "none"
  | "pink"
  | "yellow"
  | "green"
  | "blue"
  | "cream"
  | "star"
  | "smallDot"
  | "bigDot";

type CharacterFrameId = "none" | "momo" | "boro" | "lumi" | "zuni";

type FrameId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export const frameIdMapping = {
  // Basic frames (1-8)
  "1": { type: "basic" as const, id: "pink" as BasicFrameId },
  "2": { type: "basic" as const, id: "yellow" as BasicFrameId },
  "3": { type: "basic" as const, id: "green" as BasicFrameId },
  "4": { type: "basic" as const, id: "blue" as BasicFrameId },
  "5": { type: "basic" as const, id: "cream" as BasicFrameId },
  "6": { type: "basic" as const, id: "star" as BasicFrameId },
  "7": { type: "basic" as const, id: "smallDot" as BasicFrameId },
  "8": { type: "basic" as const, id: "bigDot" as BasicFrameId },
  // Character frames (9-12)
  "9": { type: "character" as const, id: "momo" as CharacterFrameId },
  "10": { type: "character" as const, id: "boro" as CharacterFrameId },
  "11": { type: "character" as const, id: "lumi" as CharacterFrameId },
  "12": { type: "character" as const, id: "zuni" as CharacterFrameId },
};

export interface FrameTemplateContextProps {
  frameId: FrameId;
  setFrameId: (id: FrameId) => void;
  // 계산된 값들 (getter 함수)
  getFrameType: () => FrameType;
  getBasicFrameId: () => BasicFrameId;
  getCharacterFrameId: () => CharacterFrameId;
  // 서버 연동을 위한 함수들
  saveFrameToServer: () => Promise<void>;
  loadFrameFromServer: () => Promise<void>;
}

export const FrameTemplateContext = createContext<
  FrameTemplateContextProps | undefined
>(undefined);

export const FrameTemplateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // localStorage에서 초기값 가져오기
  const getInitialFrameId = (): FrameId => {
    const savedFrameId = localStorage.getItem("frameId");
    if (savedFrameId && Object.keys(frameIdMapping).includes(savedFrameId)) {
      return savedFrameId as FrameId;
    }
    return "1"; // 기본값
  };

  const [frameId, setFrameId] = useState<FrameId>(getInitialFrameId);

  // frameId가 변경될 때마다 localStorage에 저장
  const handleSetFrameId = (id: FrameId) => {
    setFrameId(id);
    localStorage.setItem("frameId", id);
  };

  // 계산된 값들을 반환하는 getter 함수들
  const getFrameType = (): FrameType => {
    return frameIdMapping[frameId].type;
  };

  const getBasicFrameId = (): BasicFrameId => {
    const mapping = frameIdMapping[frameId];
    return mapping.type === "basic" ? mapping.id : "none";
  };

  const getCharacterFrameId = (): CharacterFrameId => {
    const mapping = frameIdMapping[frameId];
    return mapping.type === "character" ? mapping.id : "none";
  };

  // 서버에 프레임 정보 저장 (나중에 실제 API 호출로 대체)
  const saveFrameToServer = async (): Promise<void> => {
    try {
      const frameData = {
        frameId,
        frameType: getFrameType(),
        basicFrameId: getBasicFrameId(),
        characterFrameId: getCharacterFrameId(),
        timestamp: new Date().toISOString(),
      };

      // localStorage에 임시 저장 (실제로는 서버 API 호출)
      localStorage.setItem("frameData", JSON.stringify(frameData));

      console.log("프레임 데이터를 서버에 저장:", frameData);

      // TODO: 실제 서버 API 호출
      // await fetch('/api/frame', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(frameData)
      // });
    } catch (error) {
      console.error("서버 저장 실패:", error);
    }
  };

  // 서버에서 프레임 정보 로드 (나중에 실제 API 호출로 대체)
  const loadFrameFromServer = async (): Promise<void> => {
    try {
      // localStorage에서 임시 로드 (실제로는 서버 API 호출)
      const savedFrameData = localStorage.getItem("frameData");

      if (savedFrameData) {
        const frameData = JSON.parse(savedFrameData);
        handleSetFrameId(frameData.frameId);
        console.log("서버에서 프레임 데이터 로드:", frameData);
      }

      // TODO: 실제 서버 API 호출
      // const response = await fetch('/api/frame');
      // const frameData = await response.json();
      // handleSetFrameId(frameData.frameId);
    } catch (error) {
      console.error("서버 로드 실패:", error);
    }
  };

  return (
    <FrameTemplateContext.Provider
      value={{
        frameId,
        setFrameId: handleSetFrameId,
        getFrameType,
        getBasicFrameId,
        getCharacterFrameId,
        saveFrameToServer,
        loadFrameFromServer,
      }}
    >
      {children}
    </FrameTemplateContext.Provider>
  );
};

export const useFrameTemplate = (): FrameTemplateContextProps => {
  const context = useContext(FrameTemplateContext);
  if (!context) {
    throw new Error(
      "useFrameTemplate must be used within a FrameTemplateProvider"
    );
  }
  return context;
};
