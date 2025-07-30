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
        setFrameId,
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
