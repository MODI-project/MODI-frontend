import styles from "./RecordDetailPage.module.css";
import Frame from "../../components/common/frame/Frame";
import { useState } from "react";

const RecordDetailPage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleSaveClick = () => {
    setMessageText("사진이 갤러리에 저장되었습니다.");
    setShowMessage(true);
    // 3초 후 메시지 숨기기
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleFavoriteClick = () => {
    setMessageText("사진이 즐겨찾기에 추가되었습니다.");
    setShowMessage(true);
    // 3초 후 메시지 숨기기
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className={styles.RecordDetailPage}>
      <div className={styles.TopBar}>뒤로가기 버튼 + 일기 기록하기</div>
      <div className={styles.btn_container}>
        <button className={styles.btn} value="저장" onClick={handleSaveClick}>
          <img
            className={styles.btn_img}
            src={"../../../public/icons/save.svg"}
            alt="저장"
          />
        </button>
        <button
          className={styles.btn}
          value="즐겨찾기"
          onClick={handleFavoriteClick}
        >
          <img
            className={styles.btn_img}
            src={"../../../public/icons/favorite.svg"}
            alt="즐겨찾기"
          />
        </button>
        <button className={styles.btn} value="수정">
          <img
            className={styles.btn_img}
            src={"../../../public/icons/edit.svg"}
            alt="수정"
          />
        </button>
        <button className={styles.btn} value="삭제">
          <img
            className={styles.btn_img}
            src={"../../../public/icons/delete.svg"}
            alt="삭제"
          />
        </button>
      </div>
      <div className={styles.frame_container}>
        <Frame />
      </div>
      {showMessage && (
        <div className={styles.message_container}>
          <span className={styles.message_text}>{messageText}</span>
        </div>
      )}
      <div className={styles.BottomBar}>하단 탭 바 들어갈 자리</div>
    </div>
  );
};

export default RecordDetailPage;
