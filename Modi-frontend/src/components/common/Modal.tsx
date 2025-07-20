import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DRAG_THRESHOLD = 100; // 이만큼 아래로 드래그 하면 닫기

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const startY = useRef(0);
  const [deltaY, setDeltaY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [backdropInteractive, setBackdropInteractive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBackdropInteractive(false);
      const id = setTimeout(() => setBackdropInteractive(true), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 마우스/터치 시작
  const handleDragStart = (clientY: number) => {
    setDragging(true);
    startY.current = clientY;
  };

  // 마우스/터치 움직임
  const handleDragMove = (clientY: number) => {
    if (!dragging) return;
    const dy = clientY - startY.current;
    setDeltaY(dy > 0 ? dy : 0); // 위로 드래그 방지
  };

  // 마우스/터치 종료
  const handleDragEnd = () => {
    setDragging(false);
    if (deltaY > DRAG_THRESHOLD) {
      // 임계값 이상 drag 됐으면 닫기
      onClose();
    } else {
      // 원 위치로 복귀
      setDeltaY(0);
    }
  };

  return ReactDOM.createPortal(
    <div
      className={styles.backdrop}
      onMouseUp={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.modal}
        style={{ transform: `translateY(${deltaY}px)` }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        // 터치 이벤트
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
        onTouchEnd={handleDragEnd}
      >
        <div className={styles.handle} />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
