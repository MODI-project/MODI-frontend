import React, { createContext, useContext, useCallback, useRef } from "react";

// 이벤트 타입 정의
export type AlertEventType = "ENTER_DONG" | "LEAVE_DONG";

// 이벤트 페이로드 타입
export interface EnterDongPayload {
  dong: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export interface LeaveDongPayload {
  dong: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export type AlertPayload = EnterDongPayload | LeaveDongPayload;

// 이벤트 리스너 타입
export type AlertEventListener = (
  eventType: AlertEventType,
  payload: AlertPayload
) => void;

interface AlertBusContextType {
  subscribe: (
    eventType: AlertEventType,
    listener: AlertEventListener
  ) => () => void;
  publish: (eventType: AlertEventType, payload: AlertPayload) => void;
  unsubscribe: (
    eventType: AlertEventType,
    listener: AlertEventListener
  ) => void;
}

const AlertBusContext = createContext<AlertBusContextType | undefined>(
  undefined
);

interface AlertBusProviderProps {
  children: React.ReactNode;
}

export const AlertBusProvider: React.FC<AlertBusProviderProps> = ({
  children,
}) => {
  // 이벤트 리스너들을 저장하는 맵
  const listenersRef = useRef<Map<AlertEventType, Set<AlertEventListener>>>(
    new Map()
  );

  // 이벤트 구독
  const subscribe = useCallback(
    (eventType: AlertEventType, listener: AlertEventListener) => {
      if (!listenersRef.current.has(eventType)) {
        listenersRef.current.set(eventType, new Set());
      }

      const eventListeners = listenersRef.current.get(eventType)!;
      eventListeners.add(listener);

      // 구독 해제 함수 반환
      return () => {
        const eventListeners = listenersRef.current.get(eventType);
        if (eventListeners) {
          eventListeners.delete(listener);
          if (eventListeners.size === 0) {
            listenersRef.current.delete(eventType);
          }
        }
      };
    },
    []
  );

  // 이벤트 발행
  const publish = useCallback(
    (eventType: AlertEventType, payload: AlertPayload) => {
      console.log(`[AlertBus] Publishing ${eventType}:`, payload);

      const eventListeners = listenersRef.current.get(eventType);
      if (eventListeners) {
        eventListeners.forEach((listener) => {
          try {
            listener(eventType, payload);
          } catch (error) {
            console.error(
              `[AlertBus] Error in listener for ${eventType}:`,
              error
            );
          }
        });
      }
    },
    []
  );

  // 이벤트 구독 해제
  const unsubscribe = useCallback(
    (eventType: AlertEventType, listener: AlertEventListener) => {
      const eventListeners = listenersRef.current.get(eventType);
      if (eventListeners) {
        eventListeners.delete(listener);
        if (eventListeners.size === 0) {
          listenersRef.current.delete(eventType);
        }
      }
    },
    []
  );

  const value: AlertBusContextType = {
    subscribe,
    publish,
    unsubscribe,
  };

  return (
    <AlertBusContext.Provider value={value}>
      {children}
    </AlertBusContext.Provider>
  );
};

// Hook
export const useAlertBus = () => {
  const context = useContext(AlertBusContext);
  if (context === undefined) {
    throw new Error("useAlertBus must be used within an AlertBusProvider");
  }
  return context;
};
