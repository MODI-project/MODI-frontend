import React, { ReactNode } from "react";
import {
  FrameTemplateContext,
  FrameTemplateContextProps,
} from "./FrameTemplate";

// useFrameTemplate import하지 마세요!

const mockValue: FrameTemplateContextProps = {
  frameType: "character",
  setFrameType: () => {},
  basicFrameId: "none",
  setBasicFrameId: () => {},
  characterFrameId: "momo",
  setCharacterFrameId: () => {},
};

export const FrameTemplateMockProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <FrameTemplateContext.Provider value={mockValue}>
    {children}
  </FrameTemplateContext.Provider>
);
