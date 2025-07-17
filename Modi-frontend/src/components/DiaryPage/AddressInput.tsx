import styles from "./AddressInput.module.css";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";

const AddressInput = () => {
  const { draft, setDraft } = useDiaryDraft();

  return (
    <div className={styles.input_section}>
      <input
        type="text"
        placeholder="주소는 자동으로 입력돼요"
        value={draft.address}
        onChange={(e) => setDraft({ address: e.target.value })}
        className={styles.input_field1}
      />
      <button className={styles.edit_button}>
        <img src="/icons/edit.svg" alt="편집" />
      </button>
    </div>
  );
};

export default AddressInput;
