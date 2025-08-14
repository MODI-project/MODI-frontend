import React from "react";
import styles from "./NotificationItem.module.css";

interface NotificationItemProps {
  emotion: string;
  lastVisit: string;
  address: string;
  isRead?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  emotion,
  lastVisit,
  address,
  isRead = false,
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

  const daysSinceLastVisit = calculateDaysSinceLastVisit(lastVisit);
  const lastWord = getLastWordFromAddress(address);

  return (
    <div className={styles.notification_item}>
      {!isRead && <div className={styles.noti_alert}></div>}
      <div className={styles.noti_emotion}>
        <img src={getEmotionImagePath(emotion)} alt={emotion} />
      </div>
      <div className={styles.noti_content_container}>
        <span className={styles.noti_title}>
          {daysSinceLastVisit}일만에 {lastWord}에 왔어요!
        </span>
        <span className={styles.noti_content}>이전 기록을 확인해보세요</span>
        <span className={styles.noti_time}>00시간 전</span>
      </div>
      <button className={styles.noti_detail_btn}>
        <img src="/icons/arrow_right.svg" alt="arrow_right" />
      </button>
    </div>
  );
};

export default NotificationItem;
