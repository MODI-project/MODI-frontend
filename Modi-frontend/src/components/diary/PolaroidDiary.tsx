import React from "react";
import Frame from "../common/frame/Frame";
import TagChip from "../tag/EmotionTag";
{/* 캐릭터가 없음 */ }
import { DiaryProps } from "./Diary";
import styles from "./PolaroidDiary.module.css";


export interface PolaroidDiaryProps extends DiaryProps {
    date: string;
    photoUrl: string;
    emotion: string;
    content: string;
    clicked: boolean;
    tags?: string[];
    characterId: string;
}

const PolaroidDiary: React.FC<PolaroidDiaryProps> = ({
    date,
    photoUrl,
    emotion,
    content,
    clicked,
    tags = [],
    characterId,
}) => (
    <div className={styles.container}>
        <Frame
            photoUrl={photoUrl}
            date={date}
            summary={content}
            className={styles.frame}
        />
        <div className={styles.info}>
            <Character emotion={emotion} characterId={selectedCharacterId} />
            <div className={styles.tags}>
                {tags.map((tag, idx) => (
                    <TagChip key={idx} label={tag} />
                ))}
            </div>
        </div>
    </div>
);

export default PolaroidDiary;
