import styles from "./Preview.module.css";
import { useContext } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { mapFontName, DEFAULT_FONT } from "../../../utils/fontMap";

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
      ? "pink"
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

  const fontMap: Record<string, string> = {
    온글맆류류체: "var(--font-onryuruu)",
    이서윤체: "var(--font-leeseoyoon)",
    온글맆박다현체: "var(--font-parkdahyun)",
  };

  const defaultFont = "온글맆류류체";

  const requiresOverlay =
    characterFolder === "momo" || characterFolder === "boro";
  const characterBg = characterFolder ? characterBgMap[characterFolder] : null;

  const appliedFont = mapFontName(draft.font ?? DEFAULT_FONT);

  console.log("[Preview] appliedFont =", appliedFont);

  return (
    <div className={styles.preview_wrapper}>
      <div
        className={styles.frame_container}
        style={{ fontFamily: `${appliedFont}, sans-serif` }}
      >
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

        {draft.image ? (
          <img
            src={draft.image}
            alt="일기 사진"
            className={styles.preview_photo}
          />
        ) : (
          <div className={styles.image_placeholder} />
        )}

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
          style={{ fontFamily: fontMap[draft.font || defaultFont] }}
        >
          {draft.summary || "일기 내용 한 줄 요약"}
        </p>
      </div>
    </div>
  );
};

export default Preview;
