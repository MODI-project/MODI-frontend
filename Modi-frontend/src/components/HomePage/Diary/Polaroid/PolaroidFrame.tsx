import React, { useState, useEffect, useMemo } from "react";
import Frame from "../../../common/frame/Frame";
import styles from "./PolaroidDiary.module.css";
import { useNavigate } from "react-router-dom";
import { fetchDiaryById } from "../../../../apis/Diary/diaries.read";
import { DiaryData } from "../../../common/frame/Frame";

interface Props {
  photoUrl?: string;
  date?: string;
  emotion?: string;
  summary?: string;
  // API 연동을 위한 props
  diaryId?: string | number; // 특정 일기 ID (string 또는 number)
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

  useEffect(() => {
    setDiary(diaryData ?? null);
  }, [diaryData]);

  // diaryId가 있으면 API에서 데이터 가져오기! 명세서 참고!
  useEffect(() => {
    const missingFrame = !diary?.frame && !diaryData?.frame;
    if (diaryId && missingFrame) {
      (async () => {
        setLoading(true);
        try {
          const detail = await fetchDiaryById(diaryId); // ✅ normalizeDiaryDetail 사용
          // 기존 데이터 유지 + frame/이미지 보강
          setDiary(
            (prev) =>
              ({
                ...(prev ?? {}),
                ...detail, // detail에 frame, imageUrls[0] 등 포함
              } as DiaryData)
          );
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "일기를 불러오는데 실패했습니다."
          );
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [diaryId, diary?.frame, diaryData?.frame]);

  const resolvedDiary = useMemo<DiaryData | null>(() => {
    const src = diary ?? (diaryData as DiaryData | undefined) ?? null;
    if (!src) return null;
    const frame =
      (src as any).frame ??
      (src as any).frameId ??
      (src as any).frame_uuid ??
      (src as any).frame?.id ??
      "";

    return { ...src, frame }; // DiaryData가 frame?: string; 이므로 string으로 맞추기
  }, [diary, diaryData]);

  const handleFrameClick = () => {
    if (!resolvedDiary) return;
    navigate("/recorddetail", {
      state: { diaryId: resolvedDiary.id, diaryData: resolvedDiary },
    });
  };

  if (loading) {
    return (
      <div className={styles.loading_frame}>
        <span> 로딩 중...</span>
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
      diaryData={resolvedDiary || undefined}
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
