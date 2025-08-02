import React, { useState } from "react";
import styles from "./Setting.module.css";
import Header from "../../components/common/Header";
import ToggleSwitch from "../../components/toggle/ToggleSwitch";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  // 설정별 이벤트 처리
  //캐릭터 id 가져오기
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    // 알림 설정 이벤트
  };
  const handleGoogleDriveClick = () => {
    // 구글 드라이브 연동 이벤트
  };

  const handleLogoutClick = () => {
    // 로그아웃 이벤트
  };

  const handleWithdrawalClick = () => {
    // 회원 탈퇴 이벤트
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
          <div
            className={styles.notification}
            onClick={handleNotificationClick}
          >
            <span>알림 설정</span>
            <ToggleSwitch />
          </div>
          <div className={styles.setting_button_list}>
            <button
              className={styles.setting_item}
              onClick={handleGoogleDriveClick}
            >
              <span>구글 드라이브 연동</span>
              <img src="/icons/arrow_right.svg" />
            </button>
            <button className={styles.setting_item} onClick={handleLogoutClick}>
              <span>로그아웃</span>
              <img src="/icons/arrow_right.svg" />
            </button>
            <button
              className={styles.setting_item}
              onClick={handleWithdrawalClick}
            >
              <span>회원 탈퇴</span>
              <img src="/icons/arrow_right.svg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
