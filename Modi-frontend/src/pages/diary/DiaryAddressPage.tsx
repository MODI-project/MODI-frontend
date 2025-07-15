import styles from "./DiaryAddressPage.module.css";
import Header from "../../components/common/Header";
import PrimaryButton from "../../components/common/button/ButtonBar/PrimaryButton";
import { useNavigate } from "react-router-dom";

const DiaryAddressPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.DiaryAddress_wrapper}>
      <div className={styles.DiaryAddress_container}>
        <Header />
        <div className={styles.main_container}></div>
        <PrimaryButton
          location="next"
          label="완료"
          onClick={() => navigate(-1)}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default DiaryAddressPage;
