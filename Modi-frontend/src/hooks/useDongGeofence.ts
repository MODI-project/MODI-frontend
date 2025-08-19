import { useEffect, useRef } from "react";
import { useGeolocation } from "../contexts/GeolocationContext";
import { useAlertBus } from "../contexts/AlertBusContext";

type OnEnterDong = (payload: {
  dong: string;
  lat: number;
  lon: number;
}) => void | Promise<void>;

/**
 * 포그라운드 지오펜스(동 기준)
 * - 정확도 필터, 이동 거리 임계치, 동 안정화(연속 일치) 및 쿨타임 적용
 */
export function useDongGeofence(onEnter?: OnEnterDong) {
  const { lat, lng, dong, isTracking } = useGeolocation();
  const { publish } = useAlertBus();
  const prevDongRef = useRef<string | null>(null);
  const stableCountRef = useRef<number>(0);
  const lastCoordRef = useRef<{ lat: number; lon: number } | null>(null);
  const lastEnterAtRef = useRef<Record<string, number>>({}); // dong -> ts

  const haversine = (
    a: { lat: number; lon: number },
    b: { lat: number; lon: number }
  ) => {
    const R = 6371000; // m
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lon - a.lon) * Math.PI) / 180;
    const la1 = (a.lat * Math.PI) / 180;
    const la2 = (b.lat * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  useEffect(() => {
    if (!isTracking || !lat || !lng || !dong) return;

    const last = lastCoordRef.current;
    if (last && haversine(last, { lat, lon: lng }) < 40) return; // 이동 임계
    lastCoordRef.current = { lat, lon: lng };

    const prev = prevDongRef.current;
    if (prev === dong) {
      stableCountRef.current += 1;
    } else {
      prevDongRef.current = dong;
      stableCountRef.current = 1;
    }

    // 연속 2회 이상 같은 동일 때만 입장 처리
    if (stableCountRef.current >= 2) {
      const now = Date.now();
      const lastEnter = lastEnterAtRef.current[dong] || 0;
      // 30분 쿨타임
      if (now - lastEnter > 30 * 60 * 1000) {
        lastEnterAtRef.current[dong] = now;

        // AlertBus에 이벤트 발행
        publish("ENTER_DONG", {
          dong,
          lat,
          lng,
          timestamp: now,
        });

        // 기존 콜백도 호출 (하위 호환성)
        onEnter?.({ dong, lat, lon: lng });
      }
    }
  }, [lat, lng, dong, isTracking, onEnter]);
}
