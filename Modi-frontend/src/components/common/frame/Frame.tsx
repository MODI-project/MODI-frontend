import { useState } from "react";
import styles from "./Frame.module.css";

const Frame = () => {
  const [currentFrame, setCurrentFrame] = useState(0); // 0: 첫 번째 프레임, 1: 두 번째 프레임

  // 프레임 클릭 시 프레임 변경 : 초기화면은 프레임 전면부
  const handleFrameClick = () => {
    setCurrentFrame(currentFrame === 0 ? 1 : 0);
  };

  return (
    <div>
      {currentFrame === 0 && (
        <div className={styles.frame_container} onClick={handleFrameClick}>
          <div className={styles.front_frame}>
            <img
              className={styles.image}
              src="https://placehold.co/227x262"
              alt="사진"
            />
            <span className={styles.front_date}>25.5.13 12:17</span>
          </div>
          <span className={styles.summary}>일기 내용 한 줄 요약</span>
        </div>
      )}
      {currentFrame === 1 && (
        <div className={styles.frame_container} onClick={handleFrameClick}>
          <div className={styles.back_frame}>
            <div className={styles.frame_info}>
              <div>
                <span className={styles.back_date}>2000/00/00</span>
              </div>
              <div>
                <span className={styles.tags}>태그 자리</span>
              </div>
              <div>
                <span className={styles.place_info}>장소 정보</span>
              </div>
            </div>
            <div className={styles.frame_description}>
              <span>세부 내용</span>
              <span className={styles.description_content}>어쩌구</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Frame;
