import { useEffect, useRef, useState } from "react";
import styles from "./BottomSheet.module.css";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  minimizeOnDrag?: boolean;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  minimizeOnDrag = false,
}: BottomSheetProps) => {
  // 퍼센트 정의 (원하는 비율로 조절)
  const minHeightPercent = 43;
  const maxHeightPercent = 80;

  // px 계산용 상태 (드래그 클램프에 사용)
  const [viewportH, setViewportH] = useState<number>(window.innerHeight);
  const minHeightPx = viewportH * (minHeightPercent / 100);
  const maxHeightPx = viewportH * (maxHeightPercent / 100);

  const startY = useRef(0);
  const [translateY, setTranslateY] = useState(0); // 터치용
  const translateYRef = useRef(0); // 마우스용
  const [isMinimized, setIsMinimized] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const threshold = 100; // 필요하면 viewportH 비율(예: viewportH*0.08)로 바꿔도 됨
  const isDragging = useRef(false);

  // 창 크기 바뀌면 viewportH 갱신
  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 열릴 때 초기 높이를 최대(%로)로 맞추기
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setTranslateY(0);
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.height = `${maxHeightPercent}%`;
        }
      }, 0);
    }
  }, [isOpen, maxHeightPercent]);

  // 최소화 상태 바뀌면 %로 스냅
  useEffect(() => {
    if (!sheetRef.current) return;
    sheetRef.current.style.height = isMinimized
      ? `${minHeightPercent}%`
      : `${maxHeightPercent}%`;
  }, [isMinimized, minHeightPercent, maxHeightPercent]);

  // 리사이즈 시 현재 상태 유지한 채 %로 다시 맞춤
  useEffect(() => {
    if (!sheetRef.current) return;
    // 드래그 중이면 건드리지 않음
    if (isDragging.current) return;
    sheetRef.current.style.height = isMinimized
      ? `${minHeightPercent}%`
      : `${maxHeightPercent}%`;
  }, [viewportH, isMinimized, minHeightPercent, maxHeightPercent]);

  // 터치
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    if (sheetRef.current) {
      setCurrentHeight(sheetRef.current.getBoundingClientRect().height);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY.current;
    const newHeight = (currentHeight ?? maxHeightPx) - deltaY;
    const clamped = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));
    setTranslateY(deltaY);

    if (sheetRef.current) {
      // 드래그 중에는 px로 부드럽게
      sheetRef.current.style.height = `${clamped}px`;
    }
  };

  const handleTouchEnd = () => {
    if (translateY > threshold) {
      if (minimizeOnDrag) setIsMinimized(true);
      else onClose();
    } else if (translateY < -threshold && minimizeOnDrag && isMinimized) {
      setIsMinimized(false);
    } else {
      // 변화 없으면 현재 상태(%로)로 스냅
      if (sheetRef.current) {
        sheetRef.current.style.height = isMinimized
          ? `${minHeightPercent}%`
          : `${maxHeightPercent}%`;
      }
    }
    setTranslateY(0);
  };

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // 마우스
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    if (sheetRef.current) {
      setCurrentHeight(sheetRef.current.getBoundingClientRect().height);
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - startY.current;
    const newHeight = (currentHeight ?? maxHeightPx) - deltaY;
    const clamped = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));

    translateYRef.current = deltaY;
    if (sheetRef.current) {
      sheetRef.current.style.height = `${clamped}px`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const delta = translateYRef.current;

    if (delta > threshold) {
      if (minimizeOnDrag) setIsMinimized(true);
      else onClose();
    } else if (delta < -threshold && minimizeOnDrag && isMinimized) {
      setIsMinimized(false);
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.height = isMinimized
          ? `${minHeightPercent}%`
          : `${maxHeightPercent}%`;
      }
    }

    translateYRef.current = 0;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle} onMouseDown={handleMouseDown} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
