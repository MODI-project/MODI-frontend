import { useState, useContext } from "react";
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewedIndexes, setPreviewedIndexes] = useState<number[]>([]);
  const { setDraft } = useContext(DiaryDraftContext);

  const handlePreviewClick = (index: number) => {
    if (!previewedIndexes.includes(index)) {
      setPreviewedIndexes((prev) => [...prev, index]);
    }
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    const selected = dummyData[index];
    setDraft({
      emotion: selected.emotion,
      summary: selected.content,
    });
  };

  return (
    <div className={styles.LanguageStyle_wrapper}>
      {dummyData.map((item, index) => (
        <div key={index} onClick={() => handleSelect(index)}>
          <LanguageStyleSelector
            emotion={item.emotion}
            content={item.content}
            isPreviewed={previewedIndexes.includes(index)}
            isSelected={selectedIndex === index}
            onPreviewClick={() => handlePreviewClick(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default LanguageStyle;
