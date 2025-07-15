import styles from "./AddressInput.module.css";

interface AddressInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}
const AddressInput = ({ address, setAddress }: AddressInputProps) => {
  return (
    <>
      <div className={styles.input_section}>
        <input
          type="text"
          placeholder="주소는 자동으로 입력돼요"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input_field1}
        />
        <button className={styles.edit_button}>
          <img src="/icons/edit.svg" alt="편집" />
        </button>
      </div>
    </>
  );
};

export default AddressInput;
