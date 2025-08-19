import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img
          src="/gif/loading_small.gif"
          alt="loading animation"
          className={styles.loadingGif}
        />
        <p className={styles.text}>
          로딩중...
          <br />
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
};

export default Loading;
