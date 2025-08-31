import React, { createContext, useContext, useState, ReactNode } from "react";

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

export const frameIdMapping: Record<
  FrameId,
  { type: FrameType; id: BasicFrameId | CharacterFrameId }
> = {
  "1": { type: "basic", id: "pink" },
  "2": { type: "basic", id: "yellow" },
  "3": { type: "basic", id: "green" },
  "4": { type: "basic", id: "blue" },
  "5": { type: "basic", id: "cream" },
  "6": { type: "basic", id: "star" },
  "7": { type: "basic", id: "smallDot" },
  "8": { type: "basic", id: "bigDot" },
  "9": { type: "character", id: "momo" },
  "10": { type: "character", id: "boro" },
  "11": { type: "character", id: "lumi" },
  "12": { type: "character", id: "zuni" },
};

export interface FrameTemplateContextProps {
  frameType: FrameType;
  setFrameType: (type: FrameType) => void;
  basicFrameId: BasicFrameId;
  setBasicFrameId: (id: BasicFrameId) => void;
  characterFrameId: CharacterFrameId;
  setCharacterFrameId: (id: CharacterFrameId) => void;
  frameId: FrameId;
  setFrameId: (id: FrameId) => void;
}

export const FrameTemplateContext = createContext<
  FrameTemplateContextProps | undefined
>(undefined);

export const FrameTemplateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [frameType, setFrameType] = useState<FrameType>("basic");
  const [basicFrameId, setBasicFrameId] = useState<BasicFrameId>("none");
  const [characterFrameId, setCharacterFrameId] =
    useState<CharacterFrameId>("none");
  const [frameId, setFrameId] = useState<FrameId>("1");

  // frameId가 변경될 때 관련 값들을 자동으로 업데이트
  const handleSetFrameId = (id: FrameId) => {
    console.log("FrameTemplate - frameId 변경:", id);
    setFrameId(id);
    const mapping = frameIdMapping[id];
    console.log("FrameTemplate - mapping:", mapping);
    setFrameType(mapping.type);

    if (mapping.type === "basic") {
      setBasicFrameId(mapping.id as BasicFrameId);
      setCharacterFrameId("none");
    } else {
      setCharacterFrameId(mapping.id as CharacterFrameId);
      setBasicFrameId("none");
    }
  };

  return (
    <FrameTemplateContext.Provider
      value={{
        frameType,
        setFrameType,
        basicFrameId,
        setBasicFrameId,
        characterFrameId,
        setCharacterFrameId,
        frameId,
        setFrameId: handleSetFrameId,
      }}
    >
      {children}
    </FrameTemplateContext.Provider>
  );
};

export const useFrameTemplate = () => {
  const context = useContext(FrameTemplateContext);
  if (!context) {
    throw new Error(
      "useFrameTemplate must be used within a FrameTemplateProvider"
    );
  }
  return context;
};
