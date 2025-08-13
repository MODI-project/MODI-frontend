import styles from "./RecordDetailPage.module.css";
import Header from "../../components/common/Header";
import Frame from "../../components/common/frame/Frame";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import SaveButton from "../../components/common/button/ButtonIcon/SaveButton";
import FavoriteButton from "../../components/common/button/ButtonIcon/FavoriteButton";
import EditButton from "../../components/common/button/ButtonIcon/EditButton";
import DeleteButton from "../../components/common/button/ButtonIcon/DeleteButton";
import { useFrameTemplate } from "../../contexts/FrameTemplate";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryData } from "../../components/common/frame/Frame";
import { updateFavorite } from "../../apis/favorites";
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";

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
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const frameCardRef = useRef<HTMLDivElement>(null);

  const { frameId, setFrameId } = useFrameTemplate();
  const navigate = useNavigate();
  const location = useLocation();

  // 홈 화면에서 전달받은 일기 데이터
  const diaryData = location.state?.diaryData as DiaryData & {
    isFavorited?: boolean;
  };
  const diaryId = location.state?.diaryId as string | undefined;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // 일기 데이터의 frame 값을 FrameTemplate의 frameId로 설정
  useEffect(() => {
    if (diaryData?.frame) {
      console.log("RecordDetailPage - frame 설정:", diaryData.frame);
      setFrameId(diaryData.frame as any);
    }
  }, [diaryData, setFrameId]);

  useEffect(() => {
    if (diaryData?.isFavorited !== undefined) {
      setIsFavorite(diaryData.isFavorited);
    }
  }, [diaryData]);

  const handleSaveClick = async () => {
    const original = frameCardRef.current;
    if (!original) return;

    const FRAME_W = 230;
    const FRAME_H = 299;
    const SCALE = Math.min(3, window.devicePixelRatio || 2);

    const clone = original.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: `${FRAME_W}px`,
      height: `${FRAME_H}px`,
      zIndex: "-1",
      transform: "none",
      margin: "0",
      borderRadius: "15px",
      overflow: "hidden",
    });
    document.body.appendChild(clone);

    const photos = Array.from(
      clone.querySelectorAll<HTMLImageElement>('[data-role="photo"]')
    );
    photos.forEach((img) => {
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.maxWidth = "none";
      img.style.maxHeight = "none";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      (
        img.style as CSSStyleDeclaration & { imageOrientation?: string }
      ).imageOrientation = "from-image";
    });

    // 로드/디코드 대기 (최신 브라우저 기준)
    await Promise.all(
      photos.map(async (img) => {
        if (!img.complete) {
          await new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
          });
        }
        if (typeof img.decode === "function") {
          try {
            await img.decode();
          } catch {
            /* empty */
          }
        }
      })
    );

    try {
      const canvas = await html2canvas(clone, {
        width: FRAME_W,
        height: FRAME_H,
        scale: SCALE,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 15000,
      });

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "diary.png";
      a.click();
      setMessageText("사진이 갤러리에 저장되었습니다.");
    } catch (e) {
      console.error(e);
      setMessageText("저장에 실패했습니다.");
    } finally {
      document.body.removeChild(clone);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      await updateFavorite(Number(diaryId), !isFavorite);
      setIsFavorite((prev) => !prev);
      setMessageText(!isFavorite ? "즐겨찾기 추가됨!" : "즐겨찾기 해제됨!");
    } catch (err) {
      setMessageText("즐겨찾기 요청 실패!");
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
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
    <div className={styles.RecordDetailPage_wrapper}>
      <div className={styles.RecordDetailPage}>
        <div
          className={styles.page_detail_container}
          style={{
            backgroundImage: `url(${
              pageBackgrounds.frameId[
                String(frameId) as keyof typeof pageBackgrounds.frameId
              ]
            })`,
          }}
        >
          <Header
            left="/icons/arrow_left.svg"
            middle="기록 상세보기"
            right="/icons/home.svg"
            LeftClick={() => {
              navigate("/home");
            }}
            RightClick={() => {
              navigate("/home");
            }}
          />
          <div className={styles.btn_container}>
            <SaveButton onClick={handleSaveClick} />
            <FavoriteButton
              onClick={handleFavoriteClick}
              isFavorite={isFavorite}
            />
            <EditButton onClick={handleEditClick} />
            <DeleteButton onClick={handleDeleteClick} />
          </div>
          <div className={styles.frame_container} ref={frameContainerRef}>
            <Frame
              ref={frameCardRef}
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

            {showMessage && (
              <div className={styles.message_container}>
                <span className={styles.message_text}>{messageText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailPage;
