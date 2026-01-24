import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePopupStore } from "../../stores/popupStore";
import { useCharacter } from "../../contexts/CharacterContext";
import useLoadUserInfo, { MeResponse } from "../../apis/UserAPIS/loadUserInfo";
import styles from "./ReminderPopup.module.css";

type ReminderPopupProps = {
  /**
   * 라우트(`/reminder-popup`) 등에서 UI 확인용.
   * 스토어 값이 비어있으면 더미 데이터를 주입해 렌더합니다.
   */
  preview?: boolean;
};

const ReminderPopup = ({ preview = false }: ReminderPopupProps) => {
  const { currentPopup, isVisible, hidePopup, showPopup } = usePopupStore();
  const { character: characterFromContext } = useCharacter();
  const { fetchUserInfo } = useLoadUserInfo();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<string>("momo");

  // 프리뷰 모드에서는 스토어가 비어있으면 더미 팝업을 띄워 UI를 확인할 수 있게 합니다.
  useEffect(() => {
    if (!preview) return;
    if (isVisible && currentPopup) return;

    showPopup({
      dong: "서울 강남구 경희대",
      daysAgo: 37,
      emotion: "기쁨",
    });
  }, [preview, isVisible, currentPopup, showPopup]);

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

  // 사용자 캐릭터에 따른 리마인더 이미지 경로
  const getReminderImagePath = (char: string) =>
    `/images/reminder/reminder-${char}.svg`;

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
  const characterImagePath = getReminderImagePath(character);

  return (
    <div className={styles.reminder_popup_overlay}>
      {/* X 버튼 */}
      <div className={styles.close_button_wrapper} onClick={handleClose}>
          <img className={styles.close_button} src="/icons/X.svg" alt="close" />
        </div>
      <div className={styles.reminder_popup_box}>
        

        {/* 캐릭터 이미지 */}
        <div className={styles.character_image_container}>
          <img
            src={characterImagePath}
            alt={`${character} 리마인더`}
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
