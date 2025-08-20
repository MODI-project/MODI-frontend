import React, { useState, useEffect } from "react";
import styles from "./Setting.module.css";
import Header from "../../components/common/Header";
import ToggleSwitch from "../../components/toggle/ToggleSwitch";
import { useNavigate } from "react-router-dom";
import { handleWithdrawMembership } from "../../apis/UserAPIS/withdrawMembership";
import Popup from "../../components/common/Popup";
import { useNotificationControl } from "../../hooks/useNotificationControl";

const Setting = () => {
  // 설정별 이벤트 처리
  //캐릭터 id 가져오기
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [showWithdrawPopup, setShowWithdrawPopup] = useState<boolean>(false);
  const [notificationEnabled, setNotificationEnabled] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { handleNotificationSettingChange } = useNotificationControl();

  // 페이지 로드 시 알림 설정 상태 불러오기
  useEffect(() => {
    const savedSetting = localStorage.getItem("notification_setting");
    setNotificationEnabled(savedSetting === "true");
  }, []);

  const handleNotificationToggle = () => {
    const newValue = !notificationEnabled;
    setNotificationEnabled(newValue);
    localStorage.setItem("notification_setting", newValue.toString());
    handleNotificationSettingChange(newValue); // 알림 제어 훅에 변경 알림
    console.log("알림 설정 변경:", newValue ? "ON" : "OFF");
  };

  const handleWithdrawalClick = () => {
    // 회원 탈퇴 확인 팝업 표시
    setShowWithdrawPopup(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      console.log("회원 탈퇴 시작...");
      await handleWithdrawMembership();

      // 성공 시 로그인 페이지로 리다이렉트
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.error("회원 탈퇴 실패:", error);

      // 사용자에게 에러 메시지 표시
      const errorMessage = error.userMessage || "회원 탈퇴에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawPopup(false);
  };

  return (
    <div className={styles.setting_page_wrapper}>
      <div className={styles.setting_page_container}>
        <Header
          left="/icons/arrow_left.svg"
          middle="설정"
          LeftClick={() => {
            navigate("/mypage");
          }}
        />
        <div className={styles.setting_container}>
          <div className={styles.notification}>
            <span>알림 설정</span>
            <ToggleSwitch
              isOn={notificationEnabled}
              onToggle={handleNotificationToggle}
            />
          </div>

          <button
            className={styles.setting_item}
            onClick={handleWithdrawalClick}
          >
            <span>회원 탈퇴</span>
            <img src="/icons/arrow_right.svg" />
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 팝업 */}
      {showWithdrawPopup && (
        <Popup
          title="정말 탈퇴하시겠어요?"
          description="탈퇴하면 저장한 기록이 모두 사라져요"
          buttons={[
            {
              label: "아니오",
              onClick: handleWithdrawCancel,
            },
            {
              label: "탈퇴하기",
              onClick: handleWithdrawConfirm,
            },
          ]}
        />
      )}
    </div>
  );
};

export default Setting;
