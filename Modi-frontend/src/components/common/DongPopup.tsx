import React, { useEffect, useState } from "react";
import { usePopupStore } from "../../stores/popupStore";
import { useNavigate } from "react-router-dom";
import { loadUserInfo } from "../../apis/UserAPIS/loadUserInfo";
import styles from "./DongPopup.module.css";

const DongPopup: React.FC = () => {
  const { isVisible, currentPopup, hidePopup } = usePopupStore();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<string>("momo");

  // 사용자 정보 로드
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await loadUserInfo();
        setCharacter(userInfo.character || "momo");
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        setCharacter("momo");
      }
    };

    if (isVisible && currentPopup) {
      fetchUserInfo();
    }
  }, [isVisible, currentPopup]);

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        hidePopup();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, hidePopup]);

  if (!isVisible || !currentPopup) {
    return null;
  }

  const handleViewRecords = () => {
    navigate("/notification-grid", {
      state: {
        address: currentPopup.dong,
      },
    });
    hidePopup();
  };

  return (
    <div className={styles.popupOverlay} onClick={hidePopup}>
      <div
        className={styles.popupContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.popupContent}>
          <button className={styles.closeButton} onClick={hidePopup}>
            <img src="/icons/close.svg" alt="닫기" />
          </button>

          <div className={styles.iconContainer}>
            <img
              src={`/images/notiPopup/${character}/${character}_${currentPopup.emotion}.svg`}
              alt="캐릭터"
              className={styles.characterIcon}
            />
          </div>

          <div className={styles.textContainer}>
            <h3 className={styles.title}>
              {currentPopup.daysAgo}일만에 {currentPopup.dong}에 왔어요!
            </h3>
            <p className={styles.message}>이전 기록을 살펴볼까요?</p>
          </div>

          <button className={styles.viewButton} onClick={handleViewRecords}>
            보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DongPopup;
