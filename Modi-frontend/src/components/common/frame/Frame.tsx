import { useFrameTemplate } from "../../../contexts/FrameTemplate";
import styles from "./Frame.module.css";
import { useState } from "react";
// 프레임별 background 이미지 경로 예시
const frameWrapperBackgrounds = {
  basic: {
    none: "",
    pink: "/images/frame-bg/basic-frame/pink-bg.svg",
    yellow: "/images/frame-bg/basic-frame/yellow-bg.svg",
    green: "/images/frame-bg/basic-frame/green-bg.svg",
    blue: "/images/frame-bg/basic-frame/blue-bg.svg",
    cream: "/images/frame-bg/basic-frame/cream-bg.svg",
    star: "/images/frame-bg/basic-frame/star-bg.svg",
    smallDot: "/images/frame-bg/basic-frame/smallDot-bg.svg",
    bigDot: "/images/frame-bg/basic-frame/bigDot-bg.svg",
  },
  character: {
    none: "",
    momo: "/images/frame-bg/basic-frame/pink-bg.svg",
    boro: "/images/frame-bg/basic-frame/yellow-bg.svg",
    lumi: "/images/frame-bg/basic-frame/green-bg.svg",
    zuni: "/images/frame-bg/basic-frame/blue-bg.svg",
  },
};

const frameBackBackgrounds = {
  basic: {
    none: "",
    pink: "",
    yellow: "",
    green: "",
    blue: "",
    cream: "",
    star: "",
    smallDot: "",
    bigDot: "",
  },
  character: {
    none: "",
    momo: "/images/frame-bg/character-frame/momo/fr-momo-bg.svg",
    boro: "/images/frame-bg/character-frame/boro/fr-boro-bg.svg",
    lumi: "",
    zuni: "",
  },
};

const frameFrontBackgrounds = {
  basic: {
    none: "",
    pink: "",
    yellow: "",
    green: "",
    blue: "",
    cream: "",
    star: "",
    smallDot: "",
    bigDot: "",
  },
  character: {
    none: "",
    momo: "/images/frame-bg/character-frame/momo/fr-momo.svg",
    boro: "/images/frame-bg/character-frame/boro/fr-boro.svg",
    lumi: "/images/frame-bg/character-frame/lumi/fr-lumi.svg",
    zuni: "/images/frame-bg/character-frame/zuni/fr-zuni.svg",
  },
};

const Frame = () => {
  const [isFlipped, setIsFlipped] = useState(false); // 프레임 클릭 시 앞뒤 전환

  const handleFrameClick = () => {
    setIsFlipped(!isFlipped);
  };

  const { frameType, basicFrameId, characterFrameId } = useFrameTemplate();
  console.log(
    "frameType:",
    frameType,
    "basicFrameId:",
    basicFrameId,
    "characterFrameId:",
    characterFrameId
  );

  const wrapperBg =
    frameType === "basic"
      ? frameWrapperBackgrounds.basic[basicFrameId]
      : frameWrapperBackgrounds.character[characterFrameId];

  const backBg =
    frameType === "basic"
      ? ""
      : frameBackBackgrounds.character[characterFrameId];

  const frontBg =
    frameType === "basic"
      ? ""
      : frameFrontBackgrounds.character[characterFrameId];

  const isColor = wrapperBg?.startsWith("var(") || wrapperBg?.startsWith("#");

  const wrapperStyle = isColor
    ? { background: wrapperBg }
    : { backgroundImage: `url(${wrapperBg})` };

  const backStyle = backBg ? { backgroundImage: `url(${backBg})` } : {};
  const frontStyle = frontBg ? { backgroundImage: `url(${frontBg})` } : {};

  return (
    <div
      className={styles.frame_wrapper}
      style={wrapperStyle}
      onClick={handleFrameClick}
    >
      <div
        className={`${styles.fore_frame} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.frame_back} style={backStyle}></div>
        <div className={styles.frame_front} style={frontStyle}></div>
        <div className={styles.image_container}>
          <img className={styles.image} src="https://placehold.co/215x286" />
        </div>
        <div className={styles.comment_container}>
          <span className={styles.comment}>일기 내용 한 줄 요약</span>
        </div>
      </div>
      <div
        className={`${styles.back_frame} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.diary_comment_container}>
          <div className={styles.diary_info_container}>
            <span className={styles.diary_date}>2000/00/00</span>
            <div className={styles.tag_container}>
              <span className={styles.tag}>#태그</span>
              <span className={styles.tag}>#태그</span>
              <span className={styles.tag}>#태그</span>
              <span className={styles.more_tag}>더보기</span>
            </div>
            <span className={styles.place_info}>장소 정보</span>
          </div>
          <div className={styles.diary_detail_container}>
            <span className={styles.diary_detail_title}>세부 내용</span>
            <span className={styles.diary_detail_content}>
              어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame;
