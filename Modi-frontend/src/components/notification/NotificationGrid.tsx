import React from "react";
import styles from "./NotificationGrid.module.css";
import { ReminderDiaryItem } from "../../apis/ReminderAPIS/remindersByAddress";

interface NotificationGridProps {
  date: string;
  diaries: ReminderDiaryItem[];
  onDiaryClick: (diaryId: number) => void;
}

const NotificationGrid: React.FC<NotificationGridProps> = ({
  date,
  diaries,
  onDiaryClick,
}) => {
  return (
    <div className={styles.notification_grid_item_container}>
      <span className={styles.notification_grid_item_date}>{date}</span>
      <div className={styles.notification_grid_item_grid}>
        {diaries.map((diary) => (
          <button
            key={diary.id}
            className={styles.notification_grid_item}
            onClick={() => onDiaryClick(diary.id)}
          >
            <img
              className={styles.notification_grid_item_thumb}
              src={diary.thumbnailUrl || ""}
              alt="일기 썸네일"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationGrid;
