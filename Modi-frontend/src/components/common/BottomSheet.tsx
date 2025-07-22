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
  const startY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.88);
  const minHeight = 373;

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const threshold = 100;

  const isDragging = useRef(false);

  // 창 크기 바뀔 때 maxHeight 다시 계산
  useEffect(() => {
    const updateMaxHeight = () => setMaxHeight(window.innerHeight * 0.88);
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setTranslateY(0);
      // 열릴 때 전체 높이로 초기화
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.height = `${maxHeight}px`;
        }
      }, 0);
    }
  }, [isOpen, maxHeight]);

  useEffect(() => {
    // 최소화 여부가 바뀌었을 때 높이 조정
    if (sheetRef.current) {
      sheetRef.current.style.height = isMinimized
        ? `${minHeight}px`
        : `${maxHeight}px`;
    }
  }, [isMinimized, maxHeight]);

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
    if (sheetRef.current) {
      sheetRef.current.style.height = `${clampedHeight}px`;
    }
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
    } else {
      // 변화가 없을 때 원래 상태로 복구
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
    setTranslateY(deltaY);
    if (sheetRef.current) {
      sheetRef.current.style.height = `${clampedHeight}px`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (translateY > threshold) {
      if (minimizeOnDrag) {
        setIsMinimized(true);
      } else {
        onClose();
      }
    } else if (translateY < -threshold && minimizeOnDrag && isMinimized) {
      setIsMinimized(false);
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.height = isMinimized
          ? `${minHeight}px`
          : `${maxHeight}px`;
      }
    }

    setTranslateY(0);

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
