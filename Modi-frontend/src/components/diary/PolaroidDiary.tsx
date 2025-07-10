import React from "react";
import Frame from "../common/frame/Frame";
import TagChip from "../tag/EmotionTag/EmotionTag";
{/* 캐릭터가 없음 */ }
import styles from "./PolaroidDiary.module.css";


export interface PolaroidDiaryProps {
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
        {/*   <Frame
            photoUrl={photoUrl}
            date={date}
            summary={content}
            className={styles.frame}
        />
        <div className={styles.info}>
            <Character emotion={emotion} characterId={characterId} />
            */}
        <div className={styles.tags}>
            {tags.map((tag, idx) => (
                <TagChip key={idx} label={tag} type="momo"/>
                {/*EmotionTagList가 완성되지 않아 임시로 캐릭터 타입은 momo로 설정*/}
            ))}
        </div>
    </div>

);

export default PolaroidDiary;
