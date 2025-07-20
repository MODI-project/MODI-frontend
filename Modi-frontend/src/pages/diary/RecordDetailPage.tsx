import styles from "./RecordDetailPage.module.css";
import Frame from "../../components/common/frame/Frame";
import { useState } from "react";
import SaveButton from "../../components/common/button/ButtonIcon/SaveButton";
import FavoriteButton from "../../components/common/button/ButtonIcon/FavoriteButton";
import EditButton from "../../components/common/button/ButtonIcon/EditButton";

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

  const handleEditClick = () => {
    setMessageText("수정 버튼이 클릭되었습니다.");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className={styles.RecordDetailPage}>
      <div className={styles.btn_container}>
        <SaveButton onClick={handleSaveClick} />
        <FavoriteButton onClick={handleFavoriteClick} isFavorite={false} />
        <EditButton onClick={handleEditClick} />
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
