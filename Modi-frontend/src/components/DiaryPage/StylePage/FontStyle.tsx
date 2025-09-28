import styles from "./FontStyle.module.css";
import { useState, useEffect } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { useContext } from "react";

const FONTS = [
  { label: "온글잎 류류체", value: "온글잎 류류체" },
  { label: "이서윤체", value: "이서윤체" },
  { label: "온글잎 박다현체", value: "온글잎 박다현체" },
];

const DEFAULT_FONT = FONTS[0].value;

export default function FontStyle() {
  const { draft, setDraft } = useContext(DiaryDraftContext);

  // 초진입 시 draft.font가 비어 있으면 맨 위 폰트를 기본값으로 세팅
  useEffect(() => {
    if (!draft.font) setDraft({ font: DEFAULT_FONT });
  }, [draft.font, setDraft]);

  const selectedFont = draft.font ?? DEFAULT_FONT;

  return (
    <ul className={styles.font_list}>
      {FONTS.map((f, i) => (
        <li
          key={f.value}
          className={[
            styles.font_item,
            styles[`font_${i + 1}`], // 개별 폰트 스타일이 필요하면 유지
            selectedFont === f.value ? styles.selected : "",
          ].join(" ")}
          onClick={() => setDraft({ font: f.value })}
        >
          {f.label}
        </li>
      ))}
    </ul>
  );
}
