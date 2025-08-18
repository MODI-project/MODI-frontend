import { useState, useContext, useEffect } from "react";
import styles from "./LanguageStyle.module.css";
import LanguageStyleSelector from "./LanguageStyleSelector";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";
import { fetchLanguageStyles } from "../../../apis/Diary/languageStyle";
import { generateStyledSummary } from "../../../apis/Diary/styleSummary";

const FIXED_START = [{ style: "없음" }];
const FIXED_END = [{ style: "다이어리" }, { style: "인터넷밈" }];

const LanguageStyle = () => {
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewedIndexes, setPreviewedIndexes] = useState<number[]>([]);
  const [apiStyles, setApiStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [previewLoadingIndex, setPreviewLoadingIndex] = useState<number | null>(
    null
  );

  const isBusy = previewLoadingIndex !== null;

  useEffect(() => {
    setPreviewedIndexes([]);
    setPreviews({});
    setSelectedIndex(null);
  }, [apiStyles]);

  useEffect(() => {
    const load = async () => {
      if (!draft.content?.trim()) {
        setApiStyles([]);
        return;
      }
      setLoading(true);
      try {
        const styles = await fetchLanguageStyles(draft.emotion, draft.content);
        setApiStyles(styles.slice(0, 4));
      } catch (e) {
        console.error("언어 스타일 불러오기 실패:", e);
        setApiStyles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [draft.content]);

  const items = [
    ...FIXED_START.map((x) => ({ style: x.style })),
    ...apiStyles.map((s) => ({ style: s })),
    ...FIXED_END.map((x) => ({ style: x.style })),
  ];

  useEffect(() => {
    const found = items.findIndex((it) => it.style === draft.style);
    if (found !== -1) {
      setSelectedIndex(found);
      setPreviewedIndexes((prev) =>
        prev.includes(found) ? prev : [...prev, found]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.style, apiStyles.length]);

  const handlePreviewClick = async (index: number) => {
    if (loading || isBusy) return;
    if (previewedIndexes.includes(index)) return;

    const label = items[index].style;
    const baseSummary =
      draft.noEmotionSummary?.trim() || draft.summary?.trim() || "";
    if (!baseSummary) {
      alert("먼저 한 줄 요약을 생성해주세요.");
      return;
    }

    try {
      setPreviewLoadingIndex(index);
      let styled = baseSummary;
      if (label !== "없음") {
        const res = await generateStyledSummary(label, baseSummary);
        styled = res?.trim() || baseSummary;
      }
      setPreviews((prev) => ({ ...prev, [label]: styled }));
      setPreviewedIndexes((prev) => [...prev, index]);
    } catch (e) {
      console.error("스타일 미리보기 실패:", e);
      alert("미리보기에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setPreviewLoadingIndex(null);
    }
  };

  const handleSelect = (index: number) => {
    if (loading || isBusy) return;
    if (!previewedIndexes.includes(index)) return;

    setSelectedIndex(index);

    const label = items[index].style;
    const styled = previews[label] ?? draft.noEmotionSummary ?? "";

    setDraft({
      style: label,
      // tone은 서버에 전달되는 필드이므로 선택된 스타일을 그대로 매핑한다.
      // "없음"은 빈 문자열로 보낸다.
      tone: label === "없음" ? "" : label,
      summary: styled,
    });
  };

  return (
    <div className={styles.LanguageStyle_wrapper}>
      {loading && (
        <div className={styles.loading}>언어 스타일 불러오는 중...</div>
      )}

      {items.map((item, index) => {
        const isPreviewed = previewedIndexes.includes(index);
        const isSelected = selectedIndex === index;
        const content = previews[item.style] ?? draft.noEmotionSummary ?? "";

        return (
          <div
            key={`${item.style}-${index}`}
            onClick={() => handleSelect(index)}
            style={{
              cursor:
                isPreviewed && !loading && !isBusy ? "pointer" : "default",
            }}
          >
            <LanguageStyleSelector
              emotion={item.style}
              content={
                previewLoadingIndex === index ? "불러오는 중..." : content
              }
              isPreviewed={isPreviewed}
              isSelected={isSelected}
              onPreviewClick={() => handlePreviewClick(index)}
              loading={previewLoadingIndex === index}
              disabled={loading || isBusy}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LanguageStyle;
