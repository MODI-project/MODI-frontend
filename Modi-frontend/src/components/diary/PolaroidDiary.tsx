import React from "react";
import Frame from "../common/frame/Frame";
import TagChip from "../tag/EmotionTag";
{/* 캐릭터가 없음 */}
import { DiaryProps } from "./Diary";
import styles from "./PolaroidDiary.module.css";


export interface PolaroidDiaryProps extends DiaryProps {
  date: string;
  photoUrl: string;
  tags?: string[];
}

const PolaroidDiary: React.FC<PolaroidDiaryProps> = ({
  date,
  photoUrl,
  emotion,
  content,
  clicked,
  tags = [],
}) => (
  <div className={styles.container}>
    <Frame
      photoUrl={photoUrl}
      date={date}
      summary={content}
      className={styles.frame}
    />
    <div className={styles.info}>
      <div className={styles.tags}>
        {tags.map((tag, idx) => (
          <TagChip key={idx} label={tag} />
        ))}
      </div>
      <Character emotion={emotion} characterId={selectedCharacterId} />
      <Diary emotion={emotion} content={content} clicked={clicked} />
    </div>
  </div>
);

export default PolaroidDiary;
