import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import styles from "./InfoSetting.module.css";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useCharacter } from "../../contexts/CharacterContext";
import { handleUserSignUp } from "../../apis/UserAPIS/signUp";

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

  // 기존 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string>("");
  const completeBtnRef = useRef<HTMLButtonElement>(null);

  // 닉네임 입력 규칙 검증
  const validateNickname = (value: string): boolean => {
    // 한글, 영어, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

    if (!value.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return false;
    }

    if (value.length > 8) {
      setNicknameError("닉네임은 8자 이내로 입력해주세요.");
      return false;
    }

    if (!nicknameRegex.test(value)) {
      setNicknameError("한글, 영어, 숫자만 입력 가능합니다.");
      return false;
    }

    setNicknameError("");
    return true;
  };

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
    setCharacter(character as any);

    // 완료 버튼을 enabled 상태로 만들고 포커스
    if (completeBtnRef.current) {
      completeBtnRef.current.focus();
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    // 실시간 유효성 검사 (에러 메시지 초기화)
    if (value.trim()) {
      validateNickname(value);
    } else {
      setNicknameError("");
    }
  };

  const handleComplete = async () => {
    if (!selectedCharacter) {
      alert("캐릭터를 선택해주세요.");
      return;
    }

    // 닉네임 유효성 검사
    if (!validateNickname(nickname)) {
      return;
    }

    // Access Token 확인
    console.log("=== 회원가입 시작 - Access Token 확인 ===");
    const accessToken = localStorage.getItem("accessToken");
    console.log("localStorage에서 토큰 존재 여부:", !!accessToken);
    if (accessToken) {
      console.log("토큰 길이:", accessToken.length);
      console.log("토큰 앞 10자리:", accessToken.substring(0, 10) + "...");
    } else {
      console.error("❌ Access Token이 없습니다!");
    }

    setIsLoading(true);

    try {
      const finalNickname = nickname.trim();

      console.log("회원가입 시작:", {
        nickname: finalNickname,
        character: selectedCharacter,
      });

      // API 호출하여 회원가입
      const userInfo = await handleUserSignUp(finalNickname, selectedCharacter);

      console.log("회원가입 성공:", userInfo);

      // 닉네임을 localStorage에 저장 (기존 코드와의 호환성을 위해)
      localStorage.setItem("nickname", finalNickname);

      if (location.state?.from === "/mypage") {
        navigate("/mypage");
      } else {
        navigate("/home"); //홈으로 이동
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.infoSetting_wrapper}>
      <div className={styles.infoSetting}>
        <Header />
        <div className={styles.setting_container}>
          <div className={styles.nicknameInput}>
            <div className={styles.nicknameInput_title}>
              닉네임을 입력해주세요
            </div>
            <input
              className={`${styles.nicknameInput_input} ${
                nicknameError ? styles.error : ""
              }`}
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="한글,영어,숫자로 8자 이내"
              maxLength={8}
            />
            {nicknameError && (
              <div className={styles.error_message}>{nicknameError}</div>
            )}
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
        </div>
        <PrimaryButton
          location="login"
          label={isLoading ? "처리 중..." : "완료"}
          onClick={handleComplete}
          disabled={
            !selectedCharacter ||
            !nickname.trim() ||
            isLoading ||
            !!nicknameError
          }
        />
      </div>
    </div>
  );
};

export default InitialSetting;
