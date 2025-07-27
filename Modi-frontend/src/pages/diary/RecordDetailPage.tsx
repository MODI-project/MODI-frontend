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
import { useFrameTemplate } from "../../contexts/FrameTemplate";

const pageBackgrounds = {
  basic: {
    none: "",
    pink: "/images/background/recordDetailPage/basicDetail/pink-detail.svg",
    yellow: "/images/background/recordDetailPage/basicDetail/yellow-detail.svg",
    green: "/images/background/recordDetailPage/basicDetail/green-detail.svg",
    blue: "/images/background/recordDetailPage/basicDetail/blue-detail.svg",
    cream: "/images/background/recordDetailPage/basicDetail/cream-detail.svg",
    star: "/images/background/recordDetailPage/basicDetail/star-detail.svg",
    smallDot:
      "/images/background/recordDetailPage/basicDetail/smallDot-detail.svg",
    bigDot: "/images/background/recordDetailPage/basicDetail/bigDot-detail.svg",
  },
  character: {
    none: "",
    momo: "/images/background/recordDetailPage/characterDetail/momo-detail.svg",
    boro: "/images/background/recordDetailPage/characterDetail/boro-detail.svg",
    lumi: "/images/background/recordDetailPage/characterDetail/lumi-detail.svg",
    zuni: "/images/background/recordDetailPage/characterDetail/zuni-detail.svg",
  },
};

const RecordDetailPage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const {
    frameType,
    setFrameType,
    basicFrameId,
    setBasicFrameId,
    characterFrameId,
    setCharacterFrameId,
  } = useFrameTemplate();

  // Frame.tsx에서 사용하는 값들을 콘솔에 출력
  console.log(
    "RecordDetailPage - frameType:",
    frameType,
    "basicFrameId:",
    basicFrameId,
    "characterFrameId:",
    characterFrameId
  );

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
      <div
        className={styles.page_detail_container}
        style={{
          backgroundImage:
            frameType === "basic"
              ? `url(${pageBackgrounds.basic[basicFrameId]})`
              : `url(${pageBackgrounds.character[characterFrameId]})`,
        }}
      ></div>
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
    </div>
  );
};

export default RecordDetailPage;
