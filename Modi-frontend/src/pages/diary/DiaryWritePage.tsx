import { useRef } from "react";
import ExifReader from "exifreader";
import { useNavigate } from "react-router-dom";
import styles from "./DiaryWritePage.module.css";
import Header from "../../components/common/Header";
import { useDiaryDraft } from "../../hooks/useDiaryDraft";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import AddressInput from "../../components/DiaryPage/AddressInput";
import KeywordInput from "../../components/DiaryPage/KeywordInput";

const DiaryWritePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const kakaoKey = import.meta.env.VITE_KAKAO_API_KEY;
  const navigate = useNavigate();

  // 전역변수 가져오기
  const { draft, setDraft } = useDiaryDraft();
  // 비활성화 조건 추가
  const isReadyToSubmit =
    draft.image && draft.address.trim() !== "" && draft.keywords.length > 2;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;
      setDraft({ image: imageUrl });

      // GPS 정보 추출
      const arrayBuffer = await file.arrayBuffer();
      const tags = await ExifReader.load(arrayBuffer);

      console.log("EXIF 태그:", tags);

      const latRaw = tags["GPSLatitude"]?.value as [number, number][];
      const lonRaw = tags["GPSLongitude"]?.value as [number, number][];

      if (
        Array.isArray(latRaw) &&
        Array.isArray(lonRaw) &&
        latRaw.length === 3 &&
        lonRaw.length === 3
      ) {
        // [ [37,1], [17,1], [383,10] ] 구조
        const parse = (dms: [number, number][]): number[] =>
          dms.map(([num, den]) => num / den);

        const lat = parse(latRaw);
        const lon = parse(lonRaw);

        const latRef = tags["GPSLatitudeRef"]?.description || "N";
        const lonRef = tags["GPSLongitudeRef"]?.description || "E";

        const latitude = convertDMSToDD(lat, latRef);
        const longitude = convertDMSToDD(lon, lonRef);
        reverseGeocode(latitude, longitude);
      } else {
        alert("GPS 데이터 형식이 잘못되었거나 없습니다.");
      }
    };

    reader.readAsDataURL(file);
  };

  const convertDMSToDD = (dms: number[], ref: string) => {
    const [degrees, minutes, seconds] = dms;
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (ref === "S" || ref === "W") dd *= -1;
    return dd;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      if (!kakaoKey) {
        console.error("Kakao API 키가 설정되지 않았습니다.");
        return;
      }

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${kakaoKey}`,
          },
        }
      );

      const data = await res.json();
      const addressName = data.documents?.[0]?.address?.address_name;
      if (addressName) {
        setDraft({ address: addressName });
      } else {
        alert("주소를 찾을 수 없어요.");
      }
    } catch (err) {
      console.error("역지오코딩 실패", err);
    }
  };

  return (
    <div className={styles.DiaryWrite_wrapper}>
      <div className={styles.DiaryWrite_container}>
        <Header
          left="/icons/back.svg"
          middle="일기 기록하기"
          right="/icons/X.svg"
        />
        <div className={styles.main_container}>
          {/* 사진 첨부 */}
          <div
            className={styles.photo_upload_box}
            onClick={() => fileInputRef.current?.click()}
          >
            {draft.image ? (
              <img
                src={draft.image}
                alt="preview"
                className={styles.preview_image}
              />
            ) : (
              <div className={styles.upload_placeholder}>
                <img src="/icons/plus.svg" alt="plus" />
                <span className={styles.label}>사진 첨부</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* 주소 입력 */}
          <AddressInput />

          {/* 키워드 */}
          <KeywordInput />

          {/* 내용 */}
          <div className={styles.input_group}>
            <label className={styles.input_label}>내용을 입력해주세요</label>
            <textarea
              placeholder="텍스트 미입력 시 일기가 자동생성돼요"
              value={draft.content}
              onChange={(e) => setDraft({ content: e.target.value })}
              className={styles.textarea}
              rows={4}
            />
            <button className={styles.autogen_button}>
              <img src="/icons/rotate_gray.svg" /> 자동 생성
              {/* 온클릭 이벤트 달아야 함 */}
            </button>
          </div>

          {/* 다음 버튼 */}
          <div className={styles.button_area}></div>
        </div>
        <PrimaryButton
          location="next"
          label="다음"
          onClick={() => {
            navigate("/style");
          }}
          disabled={!isReadyToSubmit}
        />
      </div>
    </div>
  );
};

export default DiaryWritePage;
