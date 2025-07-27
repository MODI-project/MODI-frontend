import { useFrameTemplate } from "../../../contexts/FrameTemplate";
import styles from "./Frame.module.css";

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

  // background 스타일을 올바르게 적용
  const wrapperStyle = isColor
    ? { background: wrapperBg }
    : { backgroundImage: `url(${wrapperBg})` };

  const backStyle = backBg ? { backgroundImage: `url(${backBg})` } : {};
  const frontStyle = frontBg ? { backgroundImage: `url(${frontBg})` } : {};

  return (
    <div className={styles.frame_wrapper} style={wrapperStyle}>
      <div className={styles.frame_back} style={backStyle}></div>
      <div className={styles.frame_front} style={frontStyle}></div>
      <div className={styles.image_container}>
        <img className={styles.image} src="https://placehold.co/215x286" />
      </div>
      <div className={styles.comment_container}>
        <span className={styles.comment}>일기 내용 한 줄 요약</span>
      </div>
    </div>
  );
};

export default Frame;
