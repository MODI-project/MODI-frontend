import styles from "./Preview.module.css";
import { useContext } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";

const Preview = () => {
  const { draft } = useContext(DiaryDraftContext);

  const isCharacterTemplate =
    draft.templateId !== null && draft.templateId >= 9;

  const basicNames = [
    "pink",
    "yellow",
    "green",
    "blue",
    "star",
    "cream",
    "bigDot",
    "smallDot",
  ];
  const characterNames = ["momo", "boro", "lumi", "zuni"];

  const templateName =
    draft.templateId === null
      ? "pink" // 기본값 처리
      : draft.templateId <= 8
      ? basicNames[draft.templateId - 1]
      : characterNames[draft.templateId - 9];

  const characterFolder = isCharacterTemplate ? templateName : null;

  const characterBgMap: Record<string, string> = {
    momo: "pink",
    boro: "yellow",
    lumi: "green",
    zuni: "blue",
  };

  const requiresOverlay =
    characterFolder === "momo" || characterFolder === "boro";
  const characterBg = characterFolder ? characterBgMap[characterFolder] : null;

  return (
    <div className={styles.preview_wrapper}>
      <div className={styles.frame_container}>
        {/* 기본 배경 */}
        {!isCharacterTemplate ? (
          <img
            src={`/images/frame-bg/basic-frame/${templateName}-bg.svg`}
            alt="베이직 프레임"
            className={styles.frame_image}
          />
        ) : (
          <>
            <img
              src={`/images/frame-bg/basic-frame/${characterBg}-bg.svg`}
              alt="캐릭터 배경"
              className={styles.frame_image}
            />
            {/* 중간 프레임 */}
            {requiresOverlay && (
              <img
                src={`/images/frame-bg/character-frame/${characterFolder}/fr-${characterFolder}-bg.svg`}
                alt="캐릭터 중간 프레임"
                className={styles.frame_overlay}
              />
            )}
          </>
        )}

        {/* 회색 이미지 영역 (공통) */}
        <div className={styles.image_placeholder} />

        {/* 최상단 캐릭터 프레임 (캐릭터만) */}
        {isCharacterTemplate && (
          <img
            src={`/images/frame-bg/character-frame/${characterFolder}/fr-${characterFolder}.svg`}
            alt="캐릭터 상단 프레임"
            className={styles.frame_overlay}
          />
        )}

        {/* 요약 텍스트 */}
        <p
          className={styles.preview_text}
          style={{ fontFamily: draft.font || "inherit" }}
        >
          {draft.summary || "일기 내용 한 줄 요약"}
        </p>
      </div>
    </div>
  );
};

export default Preview;
