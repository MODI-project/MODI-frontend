import {
  useFrameTemplate,
  frameIdMapping,
} from "../../../contexts/FrameTemplate";
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

// 서버 API 명세에 맞는 DiaryData 인터페이스
export interface DiaryData {
  id: number; // 서버에서 반환하는 실제 ID (number 타입)
  date: string; // "YYYY-MM-DD" 형식
  photoUrl: string; // 이미지 URL
  summary: string; // 일기 요약
  emotion: string; // 감정
  tags: string[]; // 태그 배열
  // 기존 필드들 (서버에서 제공하지 않는 경우 기본값 사용)
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
  // 서버 데이터 props
  diaryData?: DiaryData;
  // 개별 데이터 props (diaryData가 없을 때 사용)
  photoUrl?: string;
  date?: string;
  emotion?: string;
  summary?: string;
  placeInfo?: string;
  tags?: string[];
  content?: string;
}

const Frame = ({
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
}: FrameProps) => {
  const { frameId } = useFrameTemplate();
  const [isFlipped, setIsFlipped] = useState(false);

  // diaryData가 있으면 해당 일기의 frame을 사용, 없으면 전역 frameId 사용
  const currentFrameId = diaryData?.frame || frameId;

  const handleFrameClick = () => {
    if (!isAbled) return;

    if (onClick) {
      onClick();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  // diaryData가 있으면 우선 사용, 없으면 개별 props 사용
  const displayData = diaryData
    ? {
        photoUrl: diaryData.photoUrl,
        date: diaryData.date,
        emotion: diaryData.emotion,
        summary: diaryData.summary,
        placeInfo: diaryData.address,
        tags: diaryData.tags,
        content: diaryData.content,
      }
    : {
        photoUrl: photoUrl || "https://placehold.co/215x286",
        date: date || "2000/00/00",
        emotion: emotion || "기쁨",
        summary: summary || "일기 내용 한 줄 요약",
        placeInfo: placeInfo || "장소 정보",
        tags: tags,
        content:
          content ||
          "어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구",
      };

  // 안전한 frameMapping 처리
  const frameMapping =
    frameIdMapping[currentFrameId as keyof typeof frameIdMapping] ||
    frameIdMapping["1"];
  const frameType = frameMapping.type;
  const frameTypeId = frameMapping.id;

  console.log("Frame 컴포넌트 디버깅:", {
    currentFrameId,
    frameType,
    frameTypeId,
    diaryData: !!diaryData,
    diaryDataFrame: diaryData?.frame,
    displayData: {
      photoUrl: displayData.photoUrl,
      date: displayData.date,
      emotion: displayData.emotion,
      summary: displayData.summary,
      tags: displayData.tags,
      content: displayData.content?.substring(0, 50) + "...",
    },
  });

  const wrapperBg =
    frameType === "basic"
      ? frameWrapperBackgrounds.basic[
          frameTypeId as keyof typeof frameWrapperBackgrounds.basic
        ]
      : frameWrapperBackgrounds.character[
          frameTypeId as keyof typeof frameWrapperBackgrounds.character
        ];

  const backBg =
    frameType === "basic"
      ? ""
      : frameBackBackgrounds.character[
          frameTypeId as keyof typeof frameBackBackgrounds.character
        ];

  const frontBg =
    frameType === "basic"
      ? ""
      : frameFrontBackgrounds.character[
          frameTypeId as keyof typeof frameFrontBackgrounds.character
        ];

  const isColor = wrapperBg?.startsWith("var(") || wrapperBg?.startsWith("#");

  const wrapperStyle = isColor
    ? { background: wrapperBg }
    : { backgroundImage: `url(${wrapperBg})` };

  const backStyle = backBg ? { backgroundImage: `url(${backBg})` } : {};
  const frontStyle = frontBg ? { backgroundImage: `url(${frontBg})` } : {};

  return (
    <div
      className={`${styles.frame_wrapper} ${!isAbled ? styles.disabled : ""}`}
      style={wrapperStyle}
      onClick={handleFrameClick}
    >
      <div
        className={`${styles.fore_frame} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.frame_back} style={backStyle}></div>
        <div className={styles.frame_front} style={frontStyle}></div>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            src={displayData.photoUrl}
            alt="일기 사진"
            crossOrigin="anonymous"
          />
        </div>
        <div className={styles.summary_container}>
          <span className={styles.summary}>{displayData.summary}</span>
        </div>
      </div>
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
};

export default Frame;
