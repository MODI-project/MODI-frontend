import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import styles from "./InfoSetting.module.css";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useCharacter } from "../../contexts/CharacterContext";
import NotiPopUp from "../../components/notification/NotiPopUp";

interface LocationState {
  from?: string;
}

const InitialSetting = () => {
  const { setCharacter } = useCharacter();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from;
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const completeBtnRef = useRef<HTMLButtonElement>(null);

  // 기본 이메일 placeholder
  const defaultEmail = "user123@email.com";

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
    setCharacter(character as any);

    // 완료 버튼을 enabled 상태로 만들고 포커스
    if (completeBtnRef.current) {
      completeBtnRef.current.focus();
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleComplete = () => {
    // 닉네임이 비어있으면 기본 이메일 사용
    const finalNickname = nickname.trim() || defaultEmail;

    // 닉네임을 localStorage에 저장 <- API 연동하고 나서는 서버 DB에 저장할 수 있게 수정!
    localStorage.setItem("nickname", finalNickname);

    console.log("저장된 닉네임:", finalNickname);
    console.log("선택된 캐릭터:", selectedCharacter);

    if (location.state?.from === "/mypage") {
      navigate("/mypage");
    } else {
      navigate("/home"); //홈으로 이동
    }
  };

  return (
    <div className={styles.initialSetting_wrapper}>
      <div className={styles.initialSetting}>
        <Header />
        <div className={styles.nicknameInput}>
          <div className={styles.nicknameInput_title}>
            닉네임을 입력해주세요
          </div>
          <input
            className={styles.nicknameInput_input}
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder={defaultEmail}
          />
        </div>
        <div className={styles.characterSelect}>
          <div className={styles.characterSelect_title}>
            캐릭터를 선택해주세요
          </div>
          <div className={styles.character_container}>
            <label className={styles.character_label}>
              <input
                type="radio"
                name="character"
                value="momo"
                checked={selectedCharacter === "momo"}
                onChange={(e) => handleCharacterSelect(e.target.value)}
                className={styles.character_radio}
              />
              <span
                className={`${styles.momo} ${styles.character_option}`}
              ></span>
            </label>
            <label className={styles.character_label}>
              <input
                type="radio"
                name="character"
                value="boro"
                checked={selectedCharacter === "boro"}
                onChange={(e) => handleCharacterSelect(e.target.value)}
                className={styles.character_radio}
              />
              <span
                className={`${styles.boro} ${styles.character_option}`}
              ></span>
            </label>
            <label className={styles.character_label}>
              <input
                type="radio"
                name="character"
                value="lumi"
                checked={selectedCharacter === "lumi"}
                onChange={(e) => handleCharacterSelect(e.target.value)}
                className={styles.character_radio}
              />
              <span
                className={`${styles.lumi} ${styles.character_option}`}
              ></span>
            </label>
            <label className={styles.character_label}>
              <input
                type="radio"
                name="character"
                value="zuni"
                checked={selectedCharacter === "zuni"}
                onChange={(e) => handleCharacterSelect(e.target.value)}
                className={styles.character_radio}
              />
              <span
                className={`${styles.zuni} ${styles.character_option}`}
              ></span>
            </label>
          </div>
        </div>
        <PrimaryButton
          location="login"
          label="완료"
          onClick={handleComplete}
          disabled={!selectedCharacter}
        />
      </div>
    </div>
  );
};

export default InitialSetting;
