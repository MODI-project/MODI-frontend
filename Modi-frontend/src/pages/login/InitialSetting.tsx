import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import styles from "./InitialSetting.module.css";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useCharacter } from "../../contexts/CharacterContext";

const InitialSetting = () => {
  const { setCharacter } = useCharacter();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const completeBtnRef = useRef<HTMLButtonElement>(null);

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
    setCharacter(character as any);
    // 완료 버튼을 enabled 상태로 만들고 포커스
    if (completeBtnRef.current) {
      completeBtnRef.current.focus();
    }
  };

  const handleComplete = () => {
    navigate("/home"); // 홈으로 이동
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
            placeholder="user123@email.com"
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
