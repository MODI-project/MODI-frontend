import { useEffect, useRef } from "react";
import { reverseToDong } from "../apis/MapAPIS/reverseGeocode";

export interface EnterDongPayload {
  dong: string;
  lat: number;
  lon: number;
}

type OnEnterDong = (payload: EnterDongPayload) => void | Promise<void>;

/**
 * 포그라운드 지오펜스(동 기준)
 * - 정확도 필터, 이동 거리 임계치, 동 안정화(연속 일치) 및 쿨타임 적용
 */
export function useDongGeofence(onEnter: OnEnterDong) {
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
    if (!("geolocation" in navigator)) {
      console.warn("[useDongGeofence] Geolocation 미지원 브라우저");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;
        if (typeof accuracy === "number" && accuracy > 60) return; // 정확도 필터

        const last = lastCoordRef.current;
        if (last && haversine(last, { lat, lon }) < 40) return; // 이동 임계
        lastCoordRef.current = { lat, lon };

        const rg = await reverseToDong(lat, lon);
        const dong = rg?.dong;
        if (!dong) return;

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
            await onEnter({ dong, lat, lon });
          }
        }
      },
      (err) => {
        console.warn("[useDongGeofence] geolocation error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onEnter]);
}
