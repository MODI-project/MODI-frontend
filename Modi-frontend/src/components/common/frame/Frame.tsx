import {
  useFrameTemplate,
  frameIdMapping,
} from "../../../contexts/FrameTemplate";
import styles from "./Frame.module.css";
import React, { useState, forwardRef } from "react";
import { DEFAULT_FONT } from "../../../utils/fontMap";

const FALLBACK_IMG = "https://placehold.co/215x286"; // 로딩 실패 시 대체 이미지

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
  character: {
    none: "",
    momo: "/images/frame-bg/character-frame/momo/fr-momo-bg.svg",
    boro: "/images/frame-bg/character-frame/boro/fr-boro-bg.svg",
    lumi: "",
    zuni: "",
  },
};

const frameFrontBackgrounds = {
  character: {
    none: "",
    momo: "/images/frame-bg/character-frame/momo/fr-momo.svg",
    boro: "/images/frame-bg/character-frame/boro/fr-boro.svg",
    lumi: "/images/frame-bg/character-frame/lumi/fr-lumi.svg",
    zuni: "/images/frame-bg/character-frame/zuni/fr-zuni.svg",
  },
};

// 서버 API 명세에 맞춘 DiaryData 타입
export interface DiaryData {
  id: number;
  date: string;
  photoUrl: string;
  summary: string;
  emotion: string;
  tags: string[];
  content?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  tone?: string;
  font?: string;
  frame?: string;
}

interface FrameProps {
  isAbled?: boolean;
  onClick?: () => void;
  diaryData?: DiaryData;
  photoUrl?: string;
  date?: string;
  emotion?: string;
  summary?: string;
  placeInfo?: string;
  tags?: string[];
  content?: string;
}

const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame(
  {
    isAbled = true,
    onClick,
    diaryData,
    photoUrl,
    date,
    emotion,
    summary,
    placeInfo,
    tags = [],
    content,
  },
  ref
) {
  const { frameId } = useFrameTemplate();
  const [isFlipped, setIsFlipped] = useState(false);

  const currentFrameId = diaryData?.frame || frameId;

  const handleFrameClick = () => {
    if (!isAbled) return;
    if (onClick) onClick();
    else setIsFlipped(!isFlipped);
  };

  // 표시할 데이터 (diaryData 우선)
  const displayData = diaryData
    ? {
        photoUrl: diaryData.photoUrl || FALLBACK_IMG,
        date: diaryData.date,
        emotion: diaryData.emotion,
        summary: diaryData.summary,
        placeInfo: diaryData.address,
        tags: diaryData.tags,
        content: diaryData.content,
      }
    : {
        photoUrl: photoUrl || FALLBACK_IMG,
        date: date || "2000/00/00",
        emotion: emotion || "기쁨",
        summary: summary || "일기 내용 한 줄 요약",
        placeInfo: placeInfo || "장소 정보",
        tags,
        content:
          content ||
          "일기 내용이 여기에 표시됩니다. 내용이 없으면 이 문장이 기본으로 표시됩니다.",
      };

  // frameId -> type/id 변환
  const frameMapping =
    frameIdMapping[currentFrameId as keyof typeof frameIdMapping] ||
    frameIdMapping["1"];
  const frameType = frameMapping.type;
  const frameTypeId = frameMapping.id;

  // 배경 스타일 설정
  const wrapperBg =
    frameType === "basic"
      ? frameWrapperBackgrounds.basic[
          frameTypeId as keyof typeof frameWrapperBackgrounds.basic
        ]
      : frameWrapperBackgrounds.character[
          frameTypeId as keyof typeof frameWrapperBackgrounds.character
        ];

  const backBg =
    frameType === "character"
      ? frameBackBackgrounds.character[
          frameTypeId as keyof typeof frameBackBackgrounds.character
        ]
      : "";

  const frontBg =
    frameType === "character"
      ? frameFrontBackgrounds.character[
          frameTypeId as keyof typeof frameFrontBackgrounds.character
        ]
      : "";

  const isColor = wrapperBg?.startsWith("var(") || wrapperBg?.startsWith("#");
  const wrapperStyle = isColor
    ? { background: wrapperBg }
    : { backgroundImage: `url(${wrapperBg})` };
  const backStyle = backBg ? { backgroundImage: `url(${backBg})` } : {};
  const frontStyle = frontBg ? { backgroundImage: `url(${frontBg})` } : {};

  const appliedFont = diaryData?.font || DEFAULT_FONT;

  return (
    <div
      ref={ref}
      className={`${styles.frame_wrapper} ${!isAbled ? styles.disabled : ""}`}
      style={wrapperStyle}
      onClick={handleFrameClick}
    >
      {/* 앞면 */}
      <div
        className={`${styles.fore_frame} ${isFlipped ? styles.flipped : ""}`}
        style={{ ["--font-diary" as any]: appliedFont }}
      >
        <div className={styles.frame_back} style={backStyle}></div>
        <div className={styles.frame_front} style={frontStyle}></div>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            data-role="photo"
            src={displayData.photoUrl}
            alt="일기 사진"
            crossOrigin="anonymous"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
            }}
          />
        </div>
        <div className={styles.summary_container}>
          <span className={styles.summary}>{displayData.summary}</span>
        </div>
      </div>

      {/* 뒷면 */}
      <div
        className={`${styles.back_frame} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.diary_comment_container}>
          <div className={styles.diary_info_container}>
            <span className={styles.diary_date}>{displayData.date}</span>
            <div className={styles.tag_container}>
              {displayData.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
              {displayData.tags.length > 3 && (
                <span className={styles.more_tag}>더보기</span>
              )}
            </div>
            <span className={styles.place_info}>{displayData.placeInfo}</span>
          </div>
          <div className={styles.diary_detail_container}>
            <span className={styles.diary_detail_title}>세부 내용</span>
            <span className={styles.diary_detail_content}>
              {displayData.content}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Frame;
