import React, { useState, useEffect } from "react";
import styles from "./NotiPopUp.module.css";
import SmallButton from "../common/button/ButtonBar/SmallButton";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "../../contexts/CharacterContext";

// NotiPopUp props 타입 정의
interface NotiPopUpProps {
  isVisible: boolean;
  diaryData?: {
    id: number;
    date: number;
    address: string;
    emotion: string;
  } | null;
  onClose: () => void;
}

const NotiPopUp = ({ isVisible, diaryData, onClose }: NotiPopUpProps) => {
  const navigate = useNavigate();
  const { character } = useCharacter();

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  // 캐릭터와 emotion 기반 CSS 클래스 매핑
  const getCharacterClass = (characterType: string | null, emotion: string) => {
    const characterPrefix = characterType || "momo";

    // emotion을 CSS 클래스명에 맞게 변환
    const emotionMap: { [key: string]: string } = {
      기쁨: "happy",
      슬픔: "sad",
      화남: "angry",
      놀람: "surprised",
      사랑: "love",
      지루함: "bored",
      신남: "excited",
      긴장: "nervous",
      보통: "normal",
      아픔: "sick",
    };

    const emotionClass = emotionMap[emotion] || "normal";

    return (
      styles[`character_${characterPrefix}_${emotionClass}`] ||
      styles.character_momo_normal
    );
  };

  // 팝업이 표시되지 않으면 null 반환
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.noti_popup_wrapper}>
      <div className={styles.noti_popup_container}>
        <button className={styles.noti_popup_close_button} onClick={onClose} />
        <div
          className={`${styles.noti_popup_character} ${getCharacterClass(
            character,
            diaryData?.emotion || "기쁨"
          )}`}
        ></div>
        <div className={styles.noti_popup_content}>
          <div className={styles.noti_popup_text_container}>
            <span className={styles.noti_place_info}>
              {diaryData
                ? `${diaryData.date}일 만에 ${diaryData.address}에 왔어요!`
                : "37일만에 경희대에 왔어요!"}
            </span>
            <span className={styles.noti_more_info}>
              이전 기록을 살펴볼까요?
            </span>
          </div>
          <SmallButton
            label="보러가기"
            onClick={() => {
              onClose();
              if (diaryData) {
                navigate("/recorddetail", {
                  state: {
                    diaryId: diaryData.id,
                    diaryData: diaryData,
                  },
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotiPopUp;
