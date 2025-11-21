import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import styles from "./InfoSetting.module.css";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useCharacter } from "../../contexts/CharacterContext";
import { handleUserSignUp } from "../../apis/UserAPIS/signUp";
import useEditUserInfo from "../../apis/UserAPIS/editUserInfo";
import useLoadUserInfo, { MeResponse } from "../../apis/UserAPIS/loadUserInfo";
import { handleTokenRequest } from "../../apis/UserAPIS/tokenRequest";

// URL에서 code 파라미터 추출 함수
const getCodeFromURL = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

interface LocationState {
  from?: string;
}

const InitialSetting = () => {
  const { fetchUserInfo } = useLoadUserInfo();
  const { editUserInfo } = useEditUserInfo();
  const { setCharacter } = useCharacter();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from;
  // 백엔드에서 신규/기존 여부를 분기하므로 프론트에서는 별도 분기 없이 처리
  const [userInfo, setUserInfo] = useState<MeResponse | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string>("");
  const completeBtnRef = useRef<HTMLButtonElement>(null);

  // 기존 사용자 정보 불러오기 (마이페이지에서 수정하는 경우)
  useEffect(() => {
    const loadExistingUserInfo = async () => {
      if (from === "/mypage") {
        try {
          const userInfo: MeResponse = await fetchUserInfo();
          setUserInfo(userInfo);
          setSelectedCharacter(userInfo.character);
          setCharacter(userInfo.character);
          setNickname(userInfo.nickname);
        } catch (error) {
          console.error("기존 사용자 정보 불러오기 실패:", error);
          // 실패해도 계속 진행 가능
        }
      }
    };

    loadExistingUserInfo();
  }, []);

  // 페이지 로드 시 code 파라미터 확인 및 토큰 요청 (기존 회원인 경우)
  useEffect(() => {
    const checkUserInfo = async () => {
      // 먼저 사용자 정보를 확인 (이미 토큰이 발급되어 있을 수 있음)
      try {
        const userInfo = await fetchUserInfo();
        // 회원정보가 완성되어 있는지 확인 (nickname과 character가 모두 있는 경우)
        if (userInfo.nickname && userInfo.character) {
          // 기존 회원이므로 홈으로 리다이렉트
          navigate("/home");
          return;
        }
        // 신규 회원인 경우 (nickname이나 character가 없는 경우)는 페이지에 머물러야 함
      } catch (error) {
        // 사용자 정보 조회 실패 시 (토큰이 없거나 신규 회원일 수 있음)
        // URL에서 code 파라미터 확인
        const code = getCodeFromURL();
        if (code) {
          // code가 있으면 토큰 요청
          try {
            await handleTokenRequest(code);
            // 토큰 요청 성공 후 다시 사용자 정보 확인
            try {
              const userInfo = await fetchUserInfo();
              if (userInfo.nickname && userInfo.character) {
                // 기존 회원이므로 홈으로 리다이렉트
                navigate("/home");
                return;
              }
              // 신규 회원인 경우 페이지에 머물러야 함
            } catch (fetchError) {
              console.error("토큰 발급 후 사용자 정보 조회 실패:", fetchError);
              // 신규 회원일 가능성이 높으므로 페이지에 머물러야 함
            }
          } catch (tokenError) {
            console.error("토큰 요청 실패:", tokenError);
            // 토큰 요청 실패 시 회원가입 페이지에서 계속 진행 가능
          }
        }
        // code가 없고 사용자 정보도 조회 실패한 경우는 페이지에 머물러야 함
      }
    };

    checkUserInfo();
  }, [navigate, fetchUserInfo]);

  // 한글 초성이 포함되어 있는지 확인하는 함수
  const containsKoreanInitials = (value: string): boolean => {
    // 한글 초성이 하나라도 포함되어 있는지 확인
    const koreanInitialsRegex = /[ㄱ-ㅎ]/;
    return koreanInitialsRegex.test(value);
  };

  // 닉네임 입력 규칙 검증
  const validateNickname = (value: string): boolean => {
    // 한글, 영어, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

    if (!value.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return false;
    }

    // 한글 초성이 포함된 경우
    if (containsKoreanInitials(value)) {
      setNicknameError("초성은 사용할 수 없습니다.");
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

    if (completeBtnRef.current) {
      completeBtnRef.current.focus();
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 8자 제한을 엄격하게 적용
    if (value.length > 8) {
      return; // 8자를 초과하면 입력을 무시
    }

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

    // URL에서 code 파라미터 추출
    const code = getCodeFromURL();

    setIsSubmitting(true);

    try {
      const finalNickname = nickname.trim();

      const payload = {
        nickname: finalNickname,
        character: selectedCharacter,
      };

      let userInfo;

      // 분기처리 - 마이페이지에서 온 경우 회원정보 수정, 최초 회원가입인 경우 회원가입
      if (from === "/mypage") {
        // userInfo = await useEditUserInfo().editUserInfo(payload);
        userInfo = await editUserInfo(payload);
      } else {
        userInfo = await handleUserSignUp(
          finalNickname,
          selectedCharacter,
          code
        );
      }

      // API 호출 성공 후에만 캐릭터 정보 업데이트
      setCharacter(selectedCharacter as any);

      if (location.state?.from === "/mypage") {
        navigate("/mypage");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const isEditing = from === "/mypage";
      const errorMessage = isEditing
        ? "회원 정보 수정에 실패했습니다. 다시 시도해주세요."
        : "회원가입에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          label={isSubmitting ? "처리 중..." : "완료"}
          onClick={handleComplete}
          disabled={
            !selectedCharacter ||
            !nickname.trim() ||
            isSubmitting ||
            !!nicknameError
          }
        />
      </div>
    </div>
  );
};

export default InitialSetting;
