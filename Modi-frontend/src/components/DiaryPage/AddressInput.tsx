import { useState } from "react";
import styles from "./AddressInput.module.css";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import BottomSheet from "../common/BottomSheet";
const mockAddresses = [
  "서울시 어쩌구 어쩌구",
  "서울시 어쩌구",
  "경기도 어쩌구",
  "경기도 수원시 어쩌구",
  "경기도",
  "경기도 화성",
  "경기도 ㅇㅇㅇ",
];

const AddressInput = () => {
  const { draft, setDraft } = useDiaryDraft();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockAddresses.filter((addr) => addr.includes(search.trim()));

  return (
    <>
      <div className={styles.input_section}>
        <input
          placeholder="주소는 자동으로 입력돼요"
          value={draft.address}
          className={styles.input_field1}
          readOnly
          tabIndex={-1}
        />
        <button
          type="button"
          className={styles.edit_button}
          onClick={() => setIsSheetOpen(true)}
        >
          <img src="/icons/edit.svg" alt="편집" />
        </button>
      </div>

      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <div className={styles.search_container}>
          <input
            type="text"
            placeholder="주소 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search_input}
          />
          <img className={styles.search_icon} src="/icons/black_search.svg" />
        </div>

        <ul className={styles.address_list}>
          {filtered.map((addr, i) => (
            <li
              key={i}
              className={styles.address_item}
              onClick={() => {
                setDraft({ address: addr });
                setIsSheetOpen(false);
              }}
            >
              {addr}
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
};

export default AddressInput;
