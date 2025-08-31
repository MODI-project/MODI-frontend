import React from "react";
import { useCharacter } from "../../../../contexts/CharacterContext";
import EmotionTag from "../../../tag/EmotionTag/EmotionTag";
import styles from "./PolaroidDiary.module.css";

interface Props {
  tags: string[];
}

const EmotionTagList: React.FC<Props> = ({ tags }) => {
  const { character: selectedCharacter } = useCharacter();

  if (!selectedCharacter) {
    return null;
  }
  // 앞에서부터 최대 3개만
  const displayed = tags.slice(0, 3);

  return (
    <div className={styles.wrapper}>
      {displayed.map((tag, idx) => (
        <EmotionTag
          key={`${tag}-${idx}`}
          label={tag}
          type={selectedCharacter}
        />
      ))}
    </div>
  );
};

export default EmotionTagList;
