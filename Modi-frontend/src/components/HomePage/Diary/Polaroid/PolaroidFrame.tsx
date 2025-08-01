import React, { useState, useEffect } from "react";
import Frame from "../../../common/frame/Frame";
import styles from "./PolaroidDiary.module.css";
import { useNavigate } from "react-router-dom";
import { mockFetchDiaryById } from "../../../../apis/diaryInfo";
import { DiaryData } from "../../../common/frame/Frame";

interface Props {
  photoUrl?: string;
  date?: string;
  emotion?: string;
  summary?: string;
  // API 연동을 위한 props
  diaryId?: string; // 특정 일기 ID
  diaryData?: DiaryData; // 직접 전달받은 일기 데이터
}

const PolaroidFrame: React.FC<Props> = ({
  photoUrl,
  date,
  emotion,
  summary,
  diaryId,
  diaryData,
}) => {
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // diaryId가 있으면 API에서 데이터 가져오기! 명세서 참고!
  useEffect(() => {
    if (diaryId && !diaryData) {
      const fetchDiary = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await mockFetchDiaryById(diaryId);
          setDiary(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "일기를 불러오는데 실패했습니다."
          );
          console.error("일기 로드 실패:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDiary();
    }
  }, [diaryId, diaryData]);

  // diaryData가 직접 전달되면 사용
  useEffect(() => {
    if (diaryData) {
      setDiary(diaryData);
    }
  }, [diaryData]);

  const handleFrameClick = () => {
    if (diary) {
      navigate("/recorddetail", {
        state: { diaryId: diary.id, diaryData: diary },
      });
    } else {
      console.log("PolaroidFrame - diary 데이터가 없음");
      return;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading_frame}>
        <div className={styles.loading_spinner}></div>
        <span>일기를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error_frame}>
        <span>오류: {error}</span>
      </div>
    );
  }

  return (
    <Frame
      // diaryData가 있으면 우선 사용
      diaryData={diary || undefined}
      // 개별 props는 diaryData가 없을 때 사용
      photoUrl={photoUrl}
      date={date}
      emotion={emotion}
      summary={summary}
      onClick={handleFrameClick}
    />
  );
};

export default PolaroidFrame;
