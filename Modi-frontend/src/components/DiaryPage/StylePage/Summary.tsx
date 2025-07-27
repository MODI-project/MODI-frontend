import styles from "./Summary.module.css";
import FontStyle from "./FontStyle";
import { useState } from "react";

const Summary = () => {
  const [isFontStyleOpen, setIsFontStyleOpen] = useState(false);

  return (
    <div className={styles.Summary_container}>
      <button
        className={styles.Aa}
        onClick={() => setIsFontStyleOpen(!isFontStyleOpen)}
      >
        Aa
        <img src="/icons/drop.svg" />
      </button>
      {isFontStyleOpen && <FontStyle />}
      <input className={styles.content} />
      <div className={styles.autogen_button_wrapper}>
        <button className={styles.autogen_button}>
          <img src="/icons/rotate_gray.svg" /> 다시 생성하기
        </button>
      </div>
    </div>
  );
};

export default Summary;
