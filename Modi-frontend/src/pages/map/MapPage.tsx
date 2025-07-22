import styles from "./MapPage.module.css";
import { useEffect, useState } from "react";
import { loadKakaoMapAPI } from "../../utils/kakaoMapLoader";
import KakaoMap from "../../components/map/KakaoMap";
import Footer from "../../components/common/Footer";

const MapPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadKakaoMapAPI().then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <div className={styles.DiaryEmotionTag_wrapper}>
      <div className={styles.DiaryEmotionTag_container}>
        {loaded ? (
          <KakaoMap latitude={33.450701} longitude={126.570667} />
        ) : (
          <p>지도를 불러오는 중...</p>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default MapPage;
