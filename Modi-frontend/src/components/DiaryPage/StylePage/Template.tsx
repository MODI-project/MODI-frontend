import { useState, useContext } from "react";
import styles from "./Template.module.css";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";

const Template = () => {
  const [selectedTab, setSelectedTab] = useState<"basic" | "character">(
    "basic"
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const { setDraft } = useContext(DiaryDraftContext);

  const allTemplateIds = Array.from({ length: 12 }, (_, i) => i + 1);
  const templatesToRender =
    selectedTab === "basic"
      ? allTemplateIds.slice(0, 8)
      : allTemplateIds.slice(8);

  const handleTemplateClick = (id: number) => {
    setSelectedTemplateId(id);
    setDraft({ templateId: id });
  };

  return (
    <div className={styles.Template_wrapper}>
      <div className={styles.tab_buttons}>
        <button
          className={`${styles.tab_button} ${
            selectedTab === "basic" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("basic")}
        >
          기본
        </button>
        <button
          className={`${styles.tab_button} ${
            selectedTab === "character" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("character")}
        >
          캐릭터
        </button>
      </div>

      <div className={styles.template_grid}>
        {templatesToRender.map((id) => (
          <div
            key={id}
            className={`${styles.template_item} ${
              selectedTab === "character" ? styles.character_item : ""
            } ${
              selectedTemplateId === id
                ? `${styles.selected} ${
                    selectedTab === "character"
                      ? styles.selected_character
                      : styles.selected_basic
                  }`
                : ""
            }`}
            onClick={() => handleTemplateClick(id)}
          >
            <img
              className={
                selectedTab === "character"
                  ? styles.character_img
                  : styles.template_img
              }
              src={`/images/templates/template_${String(id).padStart(
                2,
                "0"
              )}.svg`}
              alt={`템플릿 ${id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template;
