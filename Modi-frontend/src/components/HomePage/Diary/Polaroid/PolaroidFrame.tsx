import React from "react";
import Frame from "../../../common/frame/Frame";
import styles from "./PolaroidDiary.module.css";

interface Props {
  photoUrl: string;
  date: string;
  emotion: string;
  summary: string;
}

const PolaroidFrame: React.FC<Props> = ({
  photoUrl,
  date,
  emotion,
  summary,
}) => (
  /*
  <Frame
    photoUrl={photoUrl}
    date={date}
    emotion={emotion}
    summary={summary}
    className={styles.frame}
  />
  */

  /* TODO: FrameProps가 준비될 때까지 임시로 주석 처리 */
  /* 임시 플레이스홀더 */
  <Frame />
);

export default PolaroidFrame;
