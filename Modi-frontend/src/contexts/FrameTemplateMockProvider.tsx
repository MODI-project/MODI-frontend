import React, { ReactNode } from "react";
import {
  FrameTemplateContext,
  FrameTemplateContextProps,
} from "./FrameTemplate";

// useFrameTemplate import하지 마세요!
const mockValue: FrameTemplateContextProps = {
  frameId: "11",
  setFrameId: () => {},
  // 계산된 값들 (getter 함수)
  getFrameType: () => "character",
  getBasicFrameId: () => "none",
  getCharacterFrameId: () => "lumi",
  // 새로 추가된 서버 연동 함수들
  saveFrameToServer: async () => {
    console.log("Mock: 프레임 데이터를 서버에 저장");
  },
  loadFrameFromServer: async () => {
    console.log("Mock: 서버에서 프레임 데이터 로드");
  },
};

// 테스트 환경에서 Context를 감싸주는 Provider
export const FrameTemplateMockProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <FrameTemplateContext.Provider value={mockValue}>
    {children}
  </FrameTemplateContext.Provider>
);
