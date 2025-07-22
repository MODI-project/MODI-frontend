import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import styles from "./KeywordInput.module.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const KeywordInput = () => {
  const navigate = useNavigate();
  const { draft, setDraft } = useDiaryDraft();

  const tags: Tag[] = draft.keywords.map((word) => ({
    id: word,
    text: word,
    className: "",
  }));

  const handleDelete = (i: number) => {
    const newKeywords = [...draft.keywords];
    newKeywords.splice(i, 1);
    setDraft({ keywords: newKeywords });
  };

  const handleAddition = (tag: Tag) => {
    const keyword = tag.text.trim();
    if (keyword && !draft.keywords.includes(keyword)) {
      setDraft({ keywords: [...draft.keywords, keyword] });
    }
  };

  return (
    <div className={styles.input_group}>
      <label className={styles.input_label}>키워드를 입력해주세요</label>
      <div onClick={() => navigate("/keyword")}>
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          delimiters={delimiters}
          placeholder={
            draft.keywords.length === 0 ? "키워드를 3개 이상 입력해주세요" : ""
          }
          classNames={{
            tags: styles.keyword_wrapper,
            tagInput: styles.tag_input,
            tagInputField: styles.input_field2,
            tag: styles.keyword_chip,
            remove: styles.remove_button,
            selected: styles.ReactTags__selected,
          }}
        />
      </div>
    </div>
  );
};

export default KeywordInput;
