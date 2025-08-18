import React from "react";
import styles from "./NotificationItem.module.css";

interface NotificationItemProps {
  id: number;
  emotion: string;
  lastVisit: string;
  address: string;
  isRead?: boolean;
  created_at?: string; // 알림 생성 시간 추가
  totalCount?: number; // 전체 일기 개수
  onClick?: () => void; // 클릭 핸들러 추가
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  emotion,
  lastVisit,
  address,
  isRead = false,
  created_at,
  onClick,
}) => {
  // emotion에 따른 이미지 경로 생성
  const getEmotionImagePath = (emotion: string) => {
    const emotionMap: { [key: string]: string } = {
      기쁨: "momo-happy.svg",
      슬픔: "momo-sad.svg",
      화남: "momo-angry.svg",
      평온: "momo-calm.svg",
      설렘: "momo-excited.svg",
      지루함: "momo-bored.svg",
      걱정: "momo-worried.svg",
      놀람: "momo-surprised.svg",
    };

    return `/emotion_tag/momo/${emotionMap[emotion] || "momo-happy.svg"}`;
  };

  // lastVisit로부터 현재까지의 일수 계산
  const calculateDaysSinceLastVisit = (lastVisit: string) => {
    const lastVisitDate = new Date(lastVisit);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - lastVisitDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // 주소에서 마지막 단어만 추출
  const getLastWordFromAddress = (address: string) => {
    if (!address || address.trim() === "") {
      return "여기";
    }
    const words = address.split(" ");
    return words[words.length - 1] || "여기";
  };

  // 알림 생성 시간으로부터 경과 시간 계산
  const getTimeAgo = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else {
      return "방금 전";
    }
  };

  const daysSinceLastVisit = calculateDaysSinceLastVisit(lastVisit);
  const lastWord = getLastWordFromAddress(address);
  const timeAgo = created_at ? getTimeAgo(created_at) : "방금 전";

  return (
    <div className={styles.notification_item} onClick={onClick}>
      {!isRead && <div className={styles.noti_alert}></div>}
      <div className={styles.noti_emotion}>
        <img src={getEmotionImagePath(emotion)} alt={emotion} />
      </div>
      <div className={styles.noti_content_container}>
        <span className={styles.noti_title}>
          {daysSinceLastVisit}일만에 {lastWord}에 왔어요!
        </span>
        <span className={styles.noti_content}>이전 기록을 확인해보세요</span>
        <span className={styles.noti_time}>{timeAgo}</span>
      </div>
      <img src="/icons/arrow_right.svg" alt="arrow_right" />
    </div>
  );
};

export default NotificationItem;
