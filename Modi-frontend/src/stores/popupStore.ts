import { create } from "zustand";

export interface PopupData {
  id: string;
  dong: string;
  daysAgo: number;
  emotion: string;
  timestamp: number;
}

interface PopupState {
  // 현재 표시 중인 팝업
  currentPopup: PopupData | null;
  // 팝업 표시 여부
  isVisible: boolean;
  // 팝업 표시
  showPopup: (popup: Omit<PopupData, "id" | "timestamp">) => void;
  // 팝업 숨기기
  hidePopup: () => void;
  // 팝업 자동 숨기기 (3초 후)
  autoHidePopup: () => void;
}

export const usePopupStore = create<PopupState>((set, get) => ({
  currentPopup: null,
  isVisible: false,

  showPopup: (popupData) => {
    const popup: PopupData = {
      ...popupData,
      id: `popup-${Date.now()}`,
      timestamp: Date.now(),
    };

    set({
      currentPopup: popup,
      isVisible: true,
    });
  },

  hidePopup: () => {
    set({
      isVisible: false,
      currentPopup: null,
    });
  },

  autoHidePopup: () => {
    const { isVisible } = get();
    if (isVisible) {
      setTimeout(() => {
        get().hidePopup();
      }, 3000);
    }
  },
}));
