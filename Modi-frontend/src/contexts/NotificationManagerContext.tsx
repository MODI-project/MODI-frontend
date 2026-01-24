import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import {
  useAlertBus,
  AlertEventType,
  EnterDongPayload,
  LeaveDongPayload,
} from "./AlertBusContext";
import { usePopupStore } from "../stores/popupStore";
import { getRemindersByAddress } from "../apis/ReminderAPIS/remindersByAddress";
import { getWeeklyReminder } from "../apis/ReminderAPIS/weeklyReminder";

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isEnabled: boolean;
}

interface NotificationManagerContextType extends NotificationState {
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  showDongNotification: (dong: string, isEnter: boolean) => void;
  toggleNotifications: () => void;
}

const NotificationManagerContext = createContext<
  NotificationManagerContextType | undefined
>(undefined);

interface NotificationManagerProviderProps {
  children: React.ReactNode;
}

export const NotificationManagerProvider: React.FC<
  NotificationManagerProviderProps
> = ({ children }) => {
  const { subscribe } = useAlertBus();
  const { showPopup } = usePopupStore();
  const location = useLocation();
  const [state, setState] = useState<NotificationState>({
    permission: "default",
    isSupported: "Notification" in window,
    isEnabled: false,
  });

  // 알림 권한 상태 확인
  const checkPermission = useCallback(() => {
    if (!state.isSupported) return;

    const permission = Notification.permission;
    const isEnabled = localStorage.getItem("notification_setting") === "true";

    setState((prev) => ({
      ...prev,
      permission,
      isEnabled: permission === "granted" && isEnabled,
    }));
  }, [state.isSupported]);

  // 권한 요청
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      console.warn("이 브라우저는 알림을 지원하지 않습니다.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const isEnabled = permission === "granted";

      setState((prev) => ({
        ...prev,
        permission,
        isEnabled,
      }));

      localStorage.setItem("notification_setting", isEnabled.toString());
      return isEnabled;
    } catch (error) {
      console.error("알림 권한 요청 실패:", error);
      return false;
    }
  }, [state.isSupported]);

  // 알림 표시
  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (
        !state.isSupported ||
        state.permission !== "granted" ||
        !state.isEnabled
      ) {
        console.log("알림이 비활성화되어 있습니다.");
        return;
      }

      try {
        const notification = new Notification(title, {
          icon: "/images/logo/Modi.svg",
          badge: "/images/logo/Modi.svg",
          tag: "modi-notification",
          requireInteraction: false,
          silent: false,
          ...options,
        });

        // 알림 클릭 시 앱 포커스
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // 5초 후 자동 닫기
        setTimeout(() => {
          notification.close();
        }, 5000);

        console.log("알림 표시:", title);
      } catch (error) {
        console.error("알림 표시 실패:", error);
      }
    },
    [state.isSupported, state.permission, state.isEnabled]
  );

  // 동 진입/이탈 알림 표시
  const showDongNotification = useCallback(
    async (dong: string, isEnter: boolean) => {
      const title = isEnter ? "새로운 동네에 도착했어요!" : "동네를 벗어났어요";
      const body = isEnter
        ? `${dong}에 도착했습니다. 이곳의 추억을 기록해보세요!`
        : `${dong}를 벗어났습니다.`;

      // 현재 페이지 확인
      const currentPath = window.location.pathname;
      const isNotificationPage = currentPath === "/notification";

      if (isNotificationPage) {
        // 알림 페이지에서는 웹 알림만 표시
        showNotification(title, {
          body,
          data: {
            dong,
            type: isEnter ? "enter" : "leave",
            timestamp: Date.now(),
          },
        });
      } else {
        // 다른 페이지에서는 팝업 표시
        try {
          // 해당 동의 최근 일기 조회
          const reminders = await getRemindersByAddress(dong);

          let daysAgo = 0;
          let emotion = "excited"; // 기본값

          if (reminders.length > 0) {
            // 가장 최근 기록 사용
            const recentReminder = reminders[0];
            const lastVisitDate = new Date(
              recentReminder.datetime || recentReminder.created_at || new Date()
            );
            const today = new Date();
            const diffTime = Math.abs(
              today.getTime() - lastVisitDate.getTime()
            );
            daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // 감정 설정
            emotion = recentReminder.emotion || "excited";
          }

          showPopup({
            dong,
            daysAgo,
            emotion,
          });
        } catch (error) {
          console.error("팝업 데이터 로드 실패:", error);
          // 에러 시 기본값으로 표시
          showPopup({
            dong,
            daysAgo: 0,
            emotion: "excited",
          });
        }
      }
    },
    [showNotification, showPopup]
  );

  // 알림 설정 토글
  const toggleNotifications = useCallback(() => {
    if (state.permission === "default") {
      requestPermission();
    } else if (state.permission === "granted") {
      const newEnabled = !state.isEnabled;
      setState((prev) => ({ ...prev, isEnabled: newEnabled }));
      localStorage.setItem("notification_setting", newEnabled.toString());
    }
  }, [state.permission, state.isEnabled, requestPermission]);

  // AlertBus 이벤트 구독
  useEffect(() => {
    const unsubscribeEnter = subscribe("ENTER_DONG", (eventType, payload) => {
      const enterPayload = payload as EnterDongPayload;
      showDongNotification(enterPayload.dong, true);
    });

    const unsubscribeLeave = subscribe("LEAVE_DONG", (eventType, payload) => {
      const leavePayload = payload as LeaveDongPayload;
      showDongNotification(leavePayload.dong, false);
    });

    return () => {
      unsubscribeEnter();
      unsubscribeLeave();
    };
  }, [subscribe, showDongNotification]);

  // 초기 권한 상태 확인
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // /home 진입 시 "새로 생성된 알림(리마인더)"이 있으면 팝업 표시
  useEffect(() => {
    if (location.pathname !== "/home") return;

    const maybeShowNewReminderPopup = async () => {
      try {
        const reminders = await getWeeklyReminder();
        if (!reminders || reminders.length === 0) return;

        // created_at 기준 최신 정렬 (API 응답 순서를 확신할 수 없으므로 방어)
        const sorted = [...reminders].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const newest = sorted[0];
        if (!newest) return;

        const lastShownId = Number(
          localStorage.getItem("last_shown_reminder_id") || "0"
        );
        if (Number.isFinite(lastShownId) && newest.id <= lastShownId) return;

        const lastVisitDate = new Date(newest.lastVisit || newest.created_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
        const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        showPopup({
          dong: newest.address,
          daysAgo,
          emotion: newest.emotion || "excited",
        });

        localStorage.setItem("last_shown_reminder_id", String(newest.id));
      } catch (error) {
        console.error("[/home reminder popup] failed:", error);
      }
    };

    void maybeShowNewReminderPopup();
  }, [location.pathname, showPopup]);

  const value: NotificationManagerContextType = {
    ...state,
    requestPermission,
    showNotification,
    showDongNotification,
    toggleNotifications,
  };

  return (
    <NotificationManagerContext.Provider value={value}>
      {children}
    </NotificationManagerContext.Provider>
  );
};

// Hook
export const useNotificationManager = () => {
  const context = useContext(NotificationManagerContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationManager must be used within a NotificationManagerProvider"
    );
  }
  return context;
};
