import styles from "./RecordDetailPage.module.css";
import Header from "../../components/common/Header";
import Frame from "../../components/common/frame/Frame";
import { useState, useEffect, useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import SaveButton from "../../components/common/button/ButtonIcon/SaveButton";
import FavoriteButton from "../../components/common/button/ButtonIcon/FavoriteButton";
import EditButton from "../../components/common/button/ButtonIcon/EditButton";
import DeleteButton from "../../components/common/button/ButtonIcon/DeleteButton";
import { useFrameTemplate } from "../../contexts/FrameTemplate";
import { useNavigate, useLocation } from "react-router-dom";
import { DiaryData } from "../../components/common/frame/Frame";
import { updateFavorite } from "../../apis/MyPageAPIS/favorites";
import { getDiaryById } from "../../apis/Diary/searchDiary";
import { deleteDiary } from "../../apis/Diary/deleteDiary";
import Popup from "../../components/common/Popup";

type DiaryApi = {
  id: number;
  content: string;
  summary: string;
  date: string;
  emotion?: { id: number; name: string } | null;
  tags?: Array<{ id: number; name: string }>;
  location?: {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  font?: string | null;
  frameId?: number | null;
  imageUrls?: string[] | null;
  favorites?: boolean; // 서버 키
  createdAt: string;
  updatedAt: string;
};

// 화면용으로 정규화
const normalizeDiary = (api: DiaryApi) => ({
  id: api.id,
  date: api.date,
  photoUrl: api.imageUrls?.[0] ?? null,
  summary: api.summary,
  emotion: api.emotion?.name ?? "",
  tags: (api.tags ?? []).map((t) => t.name),
  created_at: api.createdAt,
  favorites: !!api.favorites,
  frame: String(api.frameId ?? 1),
});

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

const fallbackImg = "https://placehold.co/215x286";

const RecordDetailPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const frameCardRef = useRef<HTMLDivElement>(null);

  const { frameId, setFrameId } = useFrameTemplate();
  const navigate = useNavigate();
  const location = useLocation();

  const diaryId = location.state?.diaryId as string | undefined;

  const [fetched, setFetched] = useState<{
    id: number;
    date: string;
    photoUrl: string | null;
    summary: string;
    emotion: string;
    tags: string[];
    created_at: string;
    favorites?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(!!diaryId);
  const [error, setError] = useState<string | null>(null);

  // id 없으면 에러 처리
  useEffect(() => {
    if (!diaryId) {
      setError("잘못된 접근입니다.");
      setLoading(false);
    }
  }, [diaryId]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!diaryId) return;
      try {
        setLoading(true);
        setError(null);

        const apiRes = (await getDiaryById(
          Number(diaryId)
        )) as unknown as DiaryApi;

        if (!active) return;

        if (!apiRes) {
          setError("기록을 찾을 수 없어요.");
        } else {
          const norm = normalizeDiary(apiRes);

          setFetched(norm);
          setIsFavorite(norm.favorites);
        }
      } catch {
        if (active) setError("기록을 불러오지 못했어요.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [diaryId]);

  const diaryForFrame: DiaryData | undefined = useMemo(() => {
    if (!fetched) return undefined;
    return {
      id: fetched.id,
      photoUrl: fetched.photoUrl ?? "",
      date: fetched.date,
      emotion: fetched.emotion,
      summary: fetched.summary,
      address: "",
      tags: fetched.tags ?? [],
      content: "",
      frame: "1",
    };
  }, [fetched]);

  // 프레임 배경 동기화(기본 1)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (diaryForFrame?.frame) setFrameId(diaryForFrame.frame as any);
    else setFrameId("1");
  }, [diaryForFrame?.frame, setFrameId]);

  // 저장
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
    } catch {
      setMessageText("저장에 실패했습니다.");
    } finally {
      document.body.removeChild(clone);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  // 즐겨찾기
  const handleFavoriteClick = async () => {
    if (isPending || !diaryId) return;
    const next = !isFavorite;

    setIsPending(true);
    setIsFavorite(next);
    setMessageText(
      next
        ? "사진이 즐겨찾기에 추가되었습니다"
        : "사진이 즐겨찾기에서 삭제되었습니다"
    );
    setShowMessage(true);

    try {
      await updateFavorite(Number(diaryId), next);
    } catch {
      setIsFavorite(!next);
      setMessageText("즐겨찾기 요청 실패!");
    } finally {
      setIsPending(false);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleEditClick = () => {
    setMessageText("수정 버튼이 클릭되었습니다.");
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleDeleteClick = () => {
    if (!diaryId || isDeleting) return;
    setConfirmOpen(true);
  };

  const runDelete = async () => {
    if (!diaryId || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteDiary(Number(diaryId));
      setConfirmOpen(false);
      setAlertOpen(true);
    } catch (e) {
      console.error(e);
      setConfirmOpen(false);
      setAlertOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    navigate("/home");
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
            right="/icons/header_home.svg"
            LeftClick={() => {
              if (location.state?.fromCreate) {
                navigate("/home");
              } else {
                navigate(-1);
              }
            }}
            RightClick={() => navigate("/home")}
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
            {/* 로딩/에러 */}
            {loading && (
              <div className={styles.message_container}>
                <span className={styles.message_text}>불러오는 중…</span>
              </div>
            )}
            {error && !loading && (
              <div className={styles.message_container}>
                <span className={styles.message_text}>{error}</span>
              </div>
            )}

            {/* 콘텐츠 */}
            {!loading && !error && (
              <Frame
                ref={frameCardRef}
                isAbled={true}
                diaryData={diaryForFrame}
                photoUrl={diaryForFrame?.photoUrl || fallbackImg}
                date={diaryForFrame?.date || "2025/01/01"}
                emotion={diaryForFrame?.emotion || "기쁨"}
                summary={diaryForFrame?.summary || "일기 내용 한 줄 요약"}
                placeInfo={diaryForFrame?.address || "장소 정보"}
                tags={diaryForFrame?.tags || []}
                content={
                  diaryForFrame?.content || "일기 내용이 여기에 표시됩니다."
                }
              />
            )}

            {showMessage && (
              <div className={styles.message_container}>
                <span className={styles.message_text}>{messageText}</span>
              </div>
            )}
            {/* 확인 팝업: 예/아니요 */}
            {confirmOpen && (
              <Popup
                title={["소중한 일기가 사라져요!", "정말 삭제 하시겠어요?"]}
                showCloseButton={false}
                onClose={() => setConfirmOpen(false)}
                buttons={[
                  {
                    label: isDeleting ? "삭제 중…" : "예",
                    onClick: () => {
                      if (isDeleting) return;
                      runDelete();
                    },
                  },
                  {
                    label: "아니요",
                    onClick: () => {
                      if (isDeleting) return;
                      setConfirmOpen(false);
                    },
                  },
                ]}
              />
            )}

            {/* 알림 팝업: 확인버튼 */}
            {alertOpen && (
              <Popup
                title={"일기가 삭제되었습니다"}
                showCloseButton={false}
                onClose={handleAlertClose}
                buttons={[
                  {
                    label: "확인",
                    onClick: handleAlertClose,
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailPage;
