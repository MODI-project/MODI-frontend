import styles from "./RecordDetailPage.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Frame from "../../components/common/frame/Frame";
import { useState } from "react";
import SaveButton from "../../components/common/button/ButtonIcon/SaveButton";
import FavoriteButton from "../../components/common/button/ButtonIcon/FavoriteButton";
import EditButton from "../../components/common/button/ButtonIcon/EditButton";
import DeleteButton from "../../components/common/button/ButtonIcon/DeleteButton";

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

  const handleDeleteClick = () => {
    setMessageText("삭제 버튼이 클릭되었습니다.");
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className={styles.RecordDetailPage}>
      <Header
        left="/icons/arrow_left.svg"
        middle="일기 상세보기"
        right="/icons/home.svg"
      />
      <div className={styles.btn_container}>
        <SaveButton onClick={handleSaveClick} />
        <FavoriteButton onClick={handleFavoriteClick} isFavorite={false} />
        <EditButton onClick={handleEditClick} />
        <DeleteButton onClick={handleDeleteClick} />
      </div>
      <div className={styles.frame_container}>
        <Frame />
      </div>
      {showMessage && (
        <div className={styles.message_container}>
          <span className={styles.message_text}>{messageText}</span>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RecordDetailPage;
