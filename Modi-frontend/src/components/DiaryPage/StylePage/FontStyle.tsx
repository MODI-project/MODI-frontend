import styles from "./FontStyle.module.css";
import { useState } from "react";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { useContext } from "react";

const FontStyle = () => {
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const [selectedFont, setSelectedFont] = useState(draft.font);

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    setDraft({ font: font });
  };

  return (
    <div>
      <ul className={styles.font_list}>
        <li
          className={`${styles.font_item} ${styles.font_1} ${
            selectedFont === "온글맆 류류체" ? styles.selected1 : ""
          }`}
          onClick={() => handleFontSelect("온글맆 류류체")}
        >
          온글맆 류류체
        </li>
        <li
          className={`${styles.font_item} ${styles.font_2} ${
            selectedFont === "이서윤체" ? styles.selected2 : ""
          }`}
          onClick={() => handleFontSelect("이서윤체")}
        >
          이서윤체
        </li>
        <li
          className={`${styles.font_item} ${styles.font_3} ${
            selectedFont === "온글맆 박다현체" ? styles.selected3 : ""
          }`}
          onClick={() => handleFontSelect("온글맆 박다현체")}
        >
          온글맆 박다현체
        </li>
      </ul>
    </div>
  );
};

export default FontStyle;
