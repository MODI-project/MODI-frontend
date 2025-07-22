import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ProfileCard.module.css";
import EditButton from "../../../components/common/button/ButtonIcon/EditButton";
import profileImg from "../../../../public/icons/profile_img.svg";
export interface ProfileCardProps {
  nickname: string;
  email: string;
}

export default function ProfileCard({ nickname, email }: ProfileCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEdit = () => {
    navigate("/information-setting", {
      state: { from: location.pathname },
      replace: false, // 원하는 옵션
    });
  };
  return (
    <div className={styles.card}>
      <div className={styles.frame}>
        <div className={styles.frame_info}>
          <img
            src={profileImg}
            alt="기본 프로필 사진"
            className={styles.profileImg}
          />
          <div className={styles.info}>
            <div className={styles.nickname}>{nickname}</div>
            <div className={styles.email}>{email}</div>
          </div>
        </div>
        <button onClick={handleEdit} className={styles.editBtn}>
          <EditButton />
        </button>
      </div>
    </div>
  );
}
