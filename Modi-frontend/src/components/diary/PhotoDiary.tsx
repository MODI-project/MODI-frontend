import React from "react";
import Diary, { DiaryProps } from "./Diary";
import styles from "./PhotoDiary.module.css";

const PhotoDiary: React.FC<DiaryProps> = ({ emotion, content, clicked }) => (
  <div className={styles.card}>
    <Diary emotion={emotion} content={content} clicked={clicked} />
  </div>
);

export default PhotoDiary;
