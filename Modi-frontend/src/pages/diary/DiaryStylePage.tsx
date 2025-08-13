import styles from "./DiaryStylePage.module.css";
import Header from "../../components/common/Header";
import BottomSheet from "../../components/common/BottomSheet";
import Tab from "../../components/common/tab/Tab";
import { useState, useRef, useEffect } from "react";
import Summary from "../../components/DiaryPage/StylePage/Summary";
import LanguageStyle from "../../components/DiaryPage/StylePage/LanguageStyle";
import Template from "../../components/DiaryPage/StylePage/Template";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useContext } from "react";
import { DiaryDraftContext } from "../../contexts/DiaryDraftContext";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/common/Popup";
import Preview from "../../components/DiaryPage/StylePage/Preview";
import { postDiary } from "../../apis/Diary/postDiary";
import { generateSummary } from "../../apis/Diary/summary";
import apiClient from "../../apis/apiClient";
import type { DiaryData } from "../../components/common/frame/Frame";

const DiaryStylePage = () => {
  const [selectedTab, setSelectedTab] = useState("한줄요약");
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [summarizing, setSummarizing] = useState(false);
  const triedRef = useRef(false);

  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    navigate("/home");
  };

  useEffect(() => {
    const needSummary =
      !!draft.content?.trim() && !draft.noEmotionSummary?.trim();

    if (!summarizing && needSummary && !triedRef.current) {
      triedRef.current = true;
      (async () => {
        try {
          setSummarizing(true);
          const s = await generateSummary(draft.content!);
          if (s) {
            setDraft({ noEmotionSummary: s });
          }
        } catch (e) {
          console.error("요약 자동 생성 실패:", e);
        } finally {
          setSummarizing(false);
        }
      })();
    }
  }, [draft.content, draft.noEmotionSummary, summarizing, setDraft]);

  // 버튼 활성화 여부 결정
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

  // 버튼 클릭 시 동작
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

        // 1) 생성
        const res = await postDiary(draft); // { diaryId, message }
        const id = res.diaryId;

        const detail = await apiClient.get(`/diaries/${id}`);
        const d = detail.data;

        const rawTags = d.tags ?? d.keywords ?? draft.keywords ?? [];
        const tags: string[] = Array.isArray(rawTags)
          ? rawTags
              .map(
                (t: any) => (typeof t === "string" ? t : t?.name ?? String(t)) // 객체면 name, 그래도 아니면 String 처리
              )
              .filter(Boolean)
          : [];

        const diaryData: DiaryData = {
          id,
          photoUrl: d.photoUrl ?? d.imageUrl ?? draft.image ?? "",
          date:
            d.date ?? d.createdDate ?? new Date().toISOString().slice(0, 10),
          emotion:
            typeof d.emotion === "string"
              ? d.emotion
              : d.emotion?.name ?? draft.emotion ?? "기쁨",
          summary:
            typeof d.summary === "string"
              ? d.summary
              : draft.summary ?? draft.noEmotionSummary ?? "",
          address:
            typeof d.address === "string" ? d.address : draft.address ?? "",
          tags,
          content:
            typeof d.content === "string" ? d.content : draft.content ?? "",
          frame: String(d.frame ?? draft.templateId ?? "1"),
        };
        navigate("/recorddetail", {
          state: {
            diaryData,
            diaryId: String(id),
            isFavorited: !!d.isFavorited,
          },
        });
      } catch (e: any) {
        console.error("status:", e?.response?.status);
        console.error("headers:", e?.response?.headers);
        console.error("data:", e?.response?.data);
        alert(e?.response?.data?.message ?? "등록 실패(400) - 콘솔 확인");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.DiaryStyle_wrapper}>
      <div className={styles.DiaryStyle_container}>
        <Header
          left="/icons/back.svg"
          LeftClick={() => navigate(-1)}
          middle="기록 작성하기"
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
                    ? "등록 중..."
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

      {/* 팝업 */}
      {isPopupOpen && (
        <Popup
          title={["작성한 일기가 저장되지 않아요!", "화면을 닫을까요?"]}
          buttons={[
            { label: "아니오", onClick: () => setIsPopupOpen(false) },
            { label: "예", onClick: handlePopupConfirm },
          ]}
        />
      )}
    </div>
  );
};

export default DiaryStylePage;
