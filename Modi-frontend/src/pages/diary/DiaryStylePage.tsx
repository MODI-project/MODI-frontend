import styles from "./DiaryStylePage.module.css";
import Header from "../../components/common/Header";
import BottomSheet from "../../components/common/BottomSheet";
import Tab from "../../components/common/tab/Tab";
import { useState, useRef, useEffect, useContext } from "react";
import Summary from "../../components/DiaryPage/StylePage/Summary";
import LanguageStyle from "../../components/DiaryPage/StylePage/LanguageStyle";
import Template from "../../components/DiaryPage/StylePage/Template";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { DiaryDraftContext } from "../../contexts/DiaryDraftContext";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "../../components/common/Popup";
import Preview from "../../components/DiaryPage/StylePage/Preview";
import { postDiary } from "../../apis/Diary/postDiary";
import { generateSummary } from "../../apis/Diary/summary";
import apiClient from "../../apis/apiClient";
import { updateDiary } from "../../apis/Diary/updateDiary";
import type { DiaryData } from "../../components/common/frame/Frame";

const DiaryStylePage = () => {
  const [selectedTab, setSelectedTab] = useState("한줄요약");
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNoChangePopup, setShowNoChangePopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const triedRef = useRef(false);

  const originalRef = useRef<null | {
    noEmotionSummary: string;
    summary: string;
    templateId: number | null;
    font: string;
    tone: string;
    style?: string;
  }>(null);

  useEffect(() => {
    if (draft.mode !== "edit") return;
    if (originalRef.current) return;

    originalRef.current = {
      noEmotionSummary: draft.noEmotionSummary ?? "",
      summary: draft.summary ?? "",
      templateId: draft.templateId ?? null,
      font: draft.font ?? "",
      tone: draft.tone ?? "",
      style: draft.style,
    };
  }, [draft.mode]);

  const equalArray = (a: string[] = [], b: string[] = []) => {
    if (a.length !== b.length) return false;
    const A = a.map((s) => s.trim()).sort();
    const B = b.map((s) => s.trim()).sort();
    return A.every((v, i) => v === B[i]);
  };

  const isDraftUnchanged = () => {
    if (draft.mode !== "edit") return false;
    const o = originalRef.current;

    const sameContent =
      (draft.originalContent ?? "").trim() === (draft.content ?? "").trim();
    const sameAddress =
      (draft.originalAddress ?? "").trim() === (draft.address ?? "").trim();
    const sameKeywords = equalArray(
      draft.originalKeywords ?? [],
      draft.keywords ?? []
    );
    const sameEmotion = (draft.originalEmotion ?? "") === (draft.emotion ?? "");
    const sameImage =
      !draft.imageChanged &&
      (draft.originalImage ?? null) === (draft.image ?? null);

    const sameStylePageFields = o
      ? (o.noEmotionSummary ?? "") === (draft.noEmotionSummary ?? "") &&
        (o.summary ?? "") === (draft.summary ?? "") &&
        (o.templateId ?? null) === (draft.templateId ?? null) &&
        (o.font ?? "") === (draft.font ?? "") &&
        (o.tone ?? "") === (draft.tone ?? "") &&
        (o.style ?? "") === (draft.style ?? "")
      : true;

    return (
      sameContent &&
      sameAddress &&
      sameKeywords &&
      sameEmotion &&
      sameImage &&
      sameStylePageFields
    );
  };

  // 요약 자동 생성
  useEffect(() => {
    const needSummary =
      !!draft.content?.trim() && !draft.noEmotionSummary?.trim();
    if (!summarizing && needSummary && !triedRef.current) {
      triedRef.current = true;
      (async () => {
        try {
          setSummarizing(true);
          const s = await generateSummary(draft.content!);
          if (s) setDraft({ noEmotionSummary: s });
        } catch (e) {
          console.error("요약 자동 생성 실패:", e);
        } finally {
          setSummarizing(false);
        }
      })();
    }
  }, [draft.content, draft.noEmotionSummary, summarizing, setDraft]);

  // 다음/완료 버튼 활성화
  const isNextEnabled =
    !submitting &&
    !summarizing &&
    (selectedTab === "한줄요약"
      ? !!(draft.font && draft.noEmotionSummary)
      : selectedTab === "언어스타일"
      ? !!(draft.emotion && draft.summary)
      : !!(
          draft.font &&
          draft.noEmotionSummary &&
          draft.emotion &&
          draft.summary &&
          draft.templateId !== null
        ));

  const goDetail = async (id: number, payloadFromServer?: unknown) => {
    const d = payloadFromServer ?? (await apiClient.get(`/diaries/${id}`)).data;

    const rawTags = d.tags ?? d.keywords ?? draft.keywords ?? [];
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags
          .map((t: string | { name?: string }) =>
            typeof t === "string" ? t : t?.name ?? String(t)
          )
          .filter(Boolean)
      : [];

    const img =
      d.imageUrls?.[0] ?? d.photoUrl ?? d.imageUrl ?? draft.image ?? ""; // 새로 고른 파일의 base64 미리보기

    const diaryData: DiaryData = {
      id,
      photoUrl: img,
      date: d.date ?? d.createdDate ?? new Date().toISOString().slice(0, 10),
      emotion:
        typeof d.emotion === "string"
          ? d.emotion
          : d.emotion?.name ?? draft.emotion ?? "기쁨",
      summary:
        typeof d.summary === "string"
          ? d.summary
          : draft.summary ?? draft.noEmotionSummary ?? "",
      address: typeof d.address === "string" ? d.address : draft.address ?? "",
      tags,
      content: typeof d.content === "string" ? d.content : draft.content ?? "",
      frame: String(d.frame ?? d.frameId ?? draft.templateId ?? "1"),
      font: typeof d.font === "string" ? d.font : draft.font ?? "LeeSeoYoon",
    };

    navigate("/recorddetail", {
      state: {
        diaryData,
        diaryId: String(id),
        isFavorited: !!d.isFavorited,
        fromCreate: draft.mode !== "edit",
        fromEdit: draft.mode === "edit",
      },
    });
  };

  // 탭 진행/완료
  const handleNext = async () => {
    if (selectedTab === "한줄요약") {
      setSelectedTab("언어스타일");
      return;
    }
    if (selectedTab === "언어스타일") {
      setSelectedTab("템플릿");
      return;
    }

    if (selectedTab === "템플릿") {
      try {
        setSubmitting(true);

        // 수정 모드
        if (draft.mode === "edit") {
          if (isDraftUnchanged()) {
            setShowNoChangePopup(true);
            return;
          }
          const id =
            (location.state?.editDiaryId as number | undefined) ??
            draft.diaryId!;
          await updateDiary(id, draft);
          await goDetail(id);
          return;
        }

        // 생성 모드
        const res = await postDiary(draft);
        const id = res.diaryId;
        await goDetail(id);
      } catch (e: unknown) {
        if (typeof e === "object" && e !== null && "response" in e) {
          const err = e as {
            response?: {
              status?: number;
              headers?: unknown;
              data?: { message?: string };
            };
          };
          console.error("status:", err.response?.status);
          console.error("headers:", err.response?.headers);
          console.error("data:", err.response?.data);
          alert(
            err.response?.data?.message ??
              (draft.mode === "edit"
                ? "수정 실패 - 콘솔 확인"
                : "등록 실패(400) - 콘솔 확인")
          );
        } else {
          console.error(e);
          alert(
            draft.mode === "edit"
              ? "수정 실패 - 콘솔 확인"
              : "등록 실패(400) - 콘솔 확인"
          );
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleExitPopupConfirm = () => {
    setIsPopupOpen(false);
    navigate("/home");
  };

  return (
    <div className={styles.DiaryStyle_wrapper}>
      <div className={styles.DiaryStyle_container}>
        <Header
          left="/icons/back.svg"
          LeftClick={() => navigate("/detail")}
          middle={"기록하기"}
          right="/icons/X.svg"
          RightClick={() => setIsPopupOpen(true)}
        />
        <div className={styles.main_container}>
          <Preview />
          <BottomSheet isOpen={true} onClose={() => {}} minimizeOnDrag={true}>
            <div className={styles.tab_container}>
              <Tab
                label="한줄요약"
                selected={selectedTab === "한줄요약"}
                onClick={() => setSelectedTab("한줄요약")}
              />
              <Tab
                label="언어스타일"
                selected={selectedTab === "언어스타일"}
                onClick={() => setSelectedTab("언어스타일")}
              />
              <Tab
                label="템플릿"
                selected={selectedTab === "템플릿"}
                onClick={() => setSelectedTab("템플릿")}
              />
            </div>

            {selectedTab === "한줄요약" ? (
              <Summary />
            ) : selectedTab === "언어스타일" ? (
              <LanguageStyle />
            ) : (
              <Template />
            )}

            <PrimaryButton
              location="next"
              label={
                selectedTab === "템플릿"
                  ? submitting
                    ? draft.mode === "edit"
                      ? "수정 중..."
                      : "등록 중..."
                    : draft.mode === "edit"
                    ? "수정 완료"
                    : "완료"
                  : summarizing
                  ? "요약 생성 중..."
                  : "다음"
              }
              onClick={handleNext}
              disabled={!isNextEnabled}
            />
          </BottomSheet>
        </div>
      </div>

      {/* 종료 확인 팝업 */}
      {isPopupOpen && (
        <Popup
          title={[
            draft.mode === "edit"
              ? "수정된 기록이 저장되지 않아요!"
              : "작성된 기록이 저장되지 않아요!",
            "정말 종료하시겠어요?",
          ]}
          buttons={
            draft.mode === "edit"
              ? [
                  { label: "예", onClick: handleExitPopupConfirm },
                  { label: "아니오", onClick: () => setIsPopupOpen(false) },
                ]
              : [
                  { label: "아니오", onClick: () => setIsPopupOpen(false) },
                  { label: "예", onClick: handleExitPopupConfirm },
                ]
          }
        />
      )}

      {/* 변경 없음 팝업 */}
      {showNoChangePopup && (
        <Popup
          title={["기록 내용이 변경되지 않았어요!", "완료하시겠어요?"]}
          buttons={[
            {
              label: "예",
              onClick: async () => {
                setShowNoChangePopup(false);
                try {
                  setSubmitting(true);
                  const id =
                    (location.state?.editDiaryId as number | undefined) ??
                    draft.diaryId!;
                  await updateDiary(id, draft);
                  await goDetail(id);
                } catch (e) {
                  console.error(e);
                  alert("수정에 실패했습니다.");
                } finally {
                  setSubmitting(false);
                }
              },
            },
            { label: "아니오", onClick: () => setShowNoChangePopup(false) },
          ]}
        />
      )}
    </div>
  );
};

export default DiaryStylePage;
