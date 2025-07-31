import React from "react";
import styles from "./NotiPopUp.module.css";
import SmallButton from "../common/button/ButtonBar/SmallButton";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "../../contexts/CharacterContext";

const NotiPopUp = () => {
  const navigate = useNavigate();
  const { character } = useCharacter();

  // 캐릭터별 CSS 클래스 매핑
  const getCharacterClass = (characterType: string | null) => {
    switch (characterType) {
      case "momo":
        return styles.character_momo;
      case "boro":
        return styles.character_boro;
      case "lumi":
        return styles.character_lumi;
      case "zuni":
        return styles.character_zuni;
      default:
        return styles.character_momo;
    }
  };

  return (
    <div className={styles.noti_popup_container}>
      <div
        className={`${styles.noti_popup_character} ${getCharacterClass(
          character
        )}`}
      ></div>
      <div className={styles.noti_popup_title}>
        <span className={styles.noti_place_info}>
          37일만에 경희대에 왔어요!
        </span>
        <span className={styles.noti_more_info}>이전 기록을 살펴볼까요?</span>
      </div>
      <SmallButton
        label="보러가기"
        onClick={() => {
          navigate("/notification");
        }}
      />
    </div>
  );
};

export default NotiPopUp;
