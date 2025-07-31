import styles from "./RecordDetailPage.module.css";
import Header from "../../components/common/Header";
import Frame from "../../components/common/frame/Frame";
import { useState, useEffect } from "react";
import SaveButton from "../../components/common/button/ButtonIcon/SaveButton";
import FavoriteButton from "../../components/common/button/ButtonIcon/FavoriteButton";
import EditButton from "../../components/common/button/ButtonIcon/EditButton";
import DeleteButton from "../../components/common/button/ButtonIcon/DeleteButton";
import { useFrameTemplate } from "../../contexts/FrameTemplate";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryData } from "../../components/common/frame/Frame";

const pageBackgrounds = {
  frameId: {
    "1": "/images/background/recordDetailPage/basicDetail/pink-detail.svg",
    "2": "/images/background/recordDetailPage/basicDetail/yellow-detail.svg",
    "3": "/images/background/recordDetailPage/basicDetail/green-detail.svg",
    "4": "/images/background/recordDetailPage/basicDetail/blue-detail.svg",
    "5": "/images/background/recordDetailPage/basicDetail/cream-detail.svg",
    "6": "/images/background/recordDetailPage/basicDetail/star-detail.svg",
    "7": "/images/background/recordDetailPage/basicDetail/smallDot-detail.svg",
    "8": "/images/background/recordDetailPage/basicDetail/bigDot-detail.svg",
    "9": "/images/background/recordDetailPage/characterDetail/momo-detail.svg",
    "10": "/images/background/recordDetailPage/characterDetail/boro-detail.svg",
    "11": "/images/background/recordDetailPage/characterDetail/lumi-detail.svg",
    "12": "/images/background/recordDetailPage/characterDetail/zuni-detail.svg",
  },
};

const RecordDetailPage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { frameId, setFrameId } = useFrameTemplate();
  const navigate = useNavigate();
  const location = useLocation();

  // 홈 화면에서 전달받은 일기 데이터
  const diaryData = location.state?.diaryData as DiaryData | undefined;
  const diaryId = location.state?.diaryId as string | undefined;

  // 일기 데이터의 frame 값을 FrameTemplate의 frameId로 설정
  useEffect(() => {
    if (diaryData?.frame) {
      console.log("RecordDetailPage - frame 설정:", diaryData.frame);
      setFrameId(diaryData.frame as any);
    }
  }, [diaryData, setFrameId]);

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
          backgroundImage: `url(${pageBackgrounds.frameId[frameId]})`,
        }}
      ></div>
      <Header
        left="/icons/arrow_left.svg"
        middle="일기 상세보기"
        right="/icons/home.svg"
        LeftClick={() => {
          navigate(-1);
        }}
        RightClick={() => {
          navigate("/home");
        }}
      />
      <div className={styles.btn_container}>
        <SaveButton onClick={handleSaveClick} />
        <FavoriteButton onClick={handleFavoriteClick} isFavorite={false} />
        <EditButton onClick={handleEditClick} />
        <DeleteButton onClick={handleDeleteClick} />
      </div>
      <div className={styles.frame_container}>
        <Frame
          isAbled={true}
          diaryData={diaryData}
          // diaryData가 없을 때 사용할 기본값들
          photoUrl={diaryData?.photoUrl || "https://placehold.co/215x286"}
          date={diaryData?.date || "2025/01/01"}
          emotion={diaryData?.emotion || "기쁨"}
          summary={diaryData?.summary || "일기 내용 한 줄 요약"}
          placeInfo={diaryData?.address || "장소 정보"}
          tags={diaryData?.tags || []}
          content={diaryData?.content || "일기 내용이 여기에 표시됩니다."}
        />
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
