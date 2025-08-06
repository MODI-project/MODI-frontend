import { useEffect, useRef, useState } from "react";
import styles from "./DatePickerBottomSheet.module.css";

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
  const startY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.8);
  const minHeight = 220;
  const translateYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const threshold = 100;

  const isDragging = useRef(false);

  // 창 크기 바뀔 때 maxHeight 다시 계산
  useEffect(() => {
    const updateMaxHeight = () => setMaxHeight(window.innerHeight * 0.8);
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setTranslateY(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    if (sheetRef.current) {
      setCurrentHeight(sheetRef.current.getBoundingClientRect().height);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY.current;
    const newHeight = (currentHeight ?? maxHeight) - deltaY;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    setTranslateY(deltaY);
  };

  const handleTouchEnd = () => {
    if (translateY > threshold) {
      if (minimizeOnDrag) {
        setIsMinimized(true);
      } else {
        onClose();
      }
    } else if (translateY < -threshold && minimizeOnDrag && isMinimized) {
      setIsMinimized(false);
    } else if (translateY !== 0) {
      // ← 추가
      // 실제 드래그했을 때만 복구
      if (sheetRef.current) {
        sheetRef.current.style.height = isMinimized
          ? `${minHeight}px`
          : `${maxHeight}px`;
      }
    }

    setTranslateY(0);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // 컴퓨터 조작 추가
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
    const newHeight = (currentHeight ?? maxHeight) - deltaY;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    translateYRef.current = deltaY;
    if (sheetRef.current) {
      sheetRef.current.style.height = `${clampedHeight}px`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const delta = translateYRef.current;

    if (delta > threshold) {
      if (minimizeOnDrag) {
        setIsMinimized(true);
      } else {
        onClose();
      }
    } else if (delta < -threshold && minimizeOnDrag && isMinimized) {
      setIsMinimized(false);
    } else if (delta !== 0) {
      if (sheetRef.current) {
        sheetRef.current.style.height = isMinimized
          ? `${minHeight}px`
          : `${maxHeight}px`;
      }
    }

    translateYRef.current = 0; // 초기화
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={sheetRef}
        className={`${styles.sheet}`}
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
