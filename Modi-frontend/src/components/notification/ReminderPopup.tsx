import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePopupStore } from "../../stores/popupStore";
import { useCharacter } from "../../contexts/CharacterContext";
import useLoadUserInfo, { MeResponse } from "../../apis/UserAPIS/loadUserInfo";
import styles from "./ReminderPopup.module.css";

const ReminderPopup = () => {
  const { currentPopup, isVisible, hidePopup } = usePopupStore();
  const { character: characterFromContext } = useCharacter();
  const { fetchUserInfo } = useLoadUserInfo();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<string>("momo");

  // 사용자 캐릭터 정보 로드
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        if (characterFromContext) {
          setCharacter(characterFromContext);
        } else {
          const userInfo: MeResponse = await fetchUserInfo();
          setCharacter(userInfo.character || "momo");
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        setCharacter("momo");
      }
    };

    if (isVisible) {
      loadCharacter();
    }
  }, [isVisible, characterFromContext, fetchUserInfo]);

  if (!isVisible || !currentPopup) {
    return null;
  }

  // emotion에 따른 캐릭터 이미지 경로 생성
  const getEmotionImagePath = (emotion: string) => {
    const emotionMap: { [key: string]: string } = {
      기쁨: `${character}-happy.svg`,
      슬픔: `${character}-sad.svg`,
      화남: `${character}-angry.svg`,
      평온: `${character}-normal.svg`,
      설렘: `${character}-excited.svg`,
      지루함: `${character}-bored.svg`,
      걱정: `${character}-nervous.svg`,
      놀람: `${character}-surprised.svg`,
    };

    return `/emotion_tag/${character}/${
      emotionMap[emotion] || `${character}-happy.svg`
    }`;
  };

  // 주소에서 마지막 단어만 추출
  const getLastWordFromAddress = (address: string) => {
    if (!address || address.trim() === "") {
      return "여기";
    }
    const words = address.split(" ");
    return words[words.length - 1] || "여기";
  };

  const handleGoSee = () => {
    hidePopup();
    navigate("/notification-grid", {
      state: {
        address: currentPopup.dong,
      },
    });
  };

  const handleClose = () => {
    hidePopup();
  };

  const lastWord = getLastWordFromAddress(currentPopup.dong);
  const characterImagePath = getEmotionImagePath(currentPopup.emotion);

  return (
    <div className={styles.reminder_popup_overlay}>
      <div className={styles.reminder_popup_box}>
        {/* X 버튼 */}
        <div className={styles.close_button_wrapper} onClick={handleClose}>
          <img className={styles.close_button} src="/icons/X.svg" alt="close" />
        </div>

        {/* 캐릭터 이미지 */}
        <div className={styles.character_image_container}>
          <img
            src={characterImagePath}
            alt={currentPopup.emotion}
            className={styles.character_image}
          />
        </div>

        {/* 메시지 */}
        <div className={styles.message_container}>
          <p className={styles.message_text}>
            {currentPopup.daysAgo}일만에 {lastWord}에 왔어요!
          </p>
          <p className={styles.sub_message_text}>이전 기록을 살펴볼까요?</p>
        </div>

        {/* 보러가기 버튼 */}
        <button className={styles.go_see_button} onClick={handleGoSee}>
          보러가기
        </button>
      </div>
    </div>
  );
};

export default ReminderPopup;
