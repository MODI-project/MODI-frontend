import { useState, useContext, useEffect } from "react";
import styles from "./LanguageStyle.module.css";
import LanguageStyleSelector from "./LanguageStyleSelector";
import { DiaryDraftContext } from "../../../contexts/DiaryDraftContext";

const dummyData = [
  {
    emotion: "즐거움",
    content: "친구들과 오랜만에 만나서 수다 떨며 웃다 보니 하루가 금방 갔다.",
  },
  {
    emotion: "슬픔",
    content:
      "따뜻한 햇살 아래 벚꽃이 참 예뻐서 산책을 다녀왔지만, 내일 비가 온다는 소식에 괜히 마음이 쓸쓸해졌다.",
  },
  {
    emotion: "고민",
    content:
      "진로에 대해 다시 고민하게 되는 하루였다. 쉽게 답이 나오지 않는다.",
  },
  {
    emotion: "화남",
    content:
      "작은 오해가 큰 말다툼으로 번져버렸다. 나도 모르게 감정이 격해졌다.",
  },
  {
    emotion: "화남",
    content:
      "기다렸던 물건이 잘못 배송되었다. 고객센터에 전화하느라 하루가 갔다.",
  },
];

const LanguageStyle = () => {
  const { draft, setDraft } = useContext(DiaryDraftContext);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewedIndexes, setPreviewedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const foundIndex = dummyData.findIndex(
      (item) => item.emotion === draft.emotion && item.content === draft.summary
    );
    if (foundIndex !== -1) {
      setSelectedIndex(foundIndex);
      setPreviewedIndexes((prev) =>
        prev.includes(foundIndex) ? prev : [...prev, foundIndex]
      );
    }
  }, [draft]);

  const handlePreviewClick = (index: number) => {
    if (!previewedIndexes.includes(index)) {
      setPreviewedIndexes((prev) => [...prev, index]);
    }
  };

  const handleSelect = (index: number) => {
    if (!previewedIndexes.includes(index)) return; // ❌ 선택은 미리보기 한 항목만 가능
    setSelectedIndex(index);
    const selected = dummyData[index];
    setDraft({
      emotion: selected.emotion,
      summary: selected.content,
    });
  };

  return (
    <div className={styles.LanguageStyle_wrapper}>
      {dummyData.map((item, index) => {
        const isPreviewed = previewedIndexes.includes(index);
        const isSelected = selectedIndex === index;

        return (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            style={{ cursor: isPreviewed ? "pointer" : "default" }}
          >
            <LanguageStyleSelector
              emotion={item.emotion}
              content={item.content}
              isPreviewed={isPreviewed}
              isSelected={isSelected}
              onPreviewClick={() => handlePreviewClick(index)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LanguageStyle;
