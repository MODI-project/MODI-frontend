import { useState } from "react";
import styles from "./AddressInput.module.css";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import BottomSheet from "../common/BottomSheet";
import { searchKakaoAddress } from "../../utils/searchAddress";
import type { AddressResult } from "../../utils/searchAddress";

const AddressInput = () => {
  const { draft, setDraft } = useDiaryDraft();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<AddressResult[]>([]);

  const handleSearch = () => {
    setHasSearched(true);
    const trimmed = search.trim();
    setResults([]);
    if (!trimmed) return;

    searchKakaoAddress(trimmed)
      .then((data) => setResults(data))
      .catch((err) => console.error(err));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          onClick={() => {
            setIsSheetOpen(true);
            setSearch("");
            setResults([]);
            setHasSearched(false);
          }}
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
            onKeyDown={handleKeyDown}
            className={styles.search_input}
          />
          <img
            className={styles.search_icon}
            src="/icons/black_search.svg"
            alt="검색"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
        </div>

        <ul className={styles.address_list}>
          {hasSearched && results.length === 0 ? (
            <li className={styles.address_item}>🔍 검색 결과가 없습니다.</li>
          ) : (
            results.map((addr, i) => (
              <li
                key={i}
                className={styles.address_item}
                onClick={() => {
                  setDraft({
                    address: addr.fullAddress,
                    dong: addr.dong,
                  });
                  setIsSheetOpen(false);
                  setHasSearched(false);
                }}
              >
                {addr.fullAddress} ({addr.dong})
              </li>
            ))
          )}
        </ul>
      </BottomSheet>
    </>
  );
};

export default AddressInput;
