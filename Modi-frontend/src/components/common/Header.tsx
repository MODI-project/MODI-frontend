import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Popup from "./Popup";

interface HeaderProps {
  left?: string;
  middle?: string;
  right?: string;
  write?: boolean;
  edit?: boolean;
}

const Header = ({ left, middle, right, write, edit }: HeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLeftClick = () => {
    if (left === "/icons/back.svg") {
      if (write || edit) {
        setShowModal(true);
      } else {
        navigate(-1);
      }
    }
    if (left === "/icons/setting.svg") {
      navigate("/setting");
    }
  };

  const handleRightClick = () => {
    if (right === "/icons/X.svg") {
      if (write || edit) {
        setShowModal(true);
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (write) {
      navigate(-1);
    } else if (edit) {
      navigate("/home");
    }
  };

  return (
    <>
      <div className={styles.header_wrapper}>
        <div className={styles.header_container}>
          {left ? (
            <img
              className={styles.button}
              src={left}
              onClick={handleLeftClick}
            />
          ) : (
            <div></div>
          )}
          {middle ? <span className={styles.func}>{middle}</span> : <div></div>}
          {right ? (
            <img
              className={styles.button}
              src={right}
              onClick={handleRightClick}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* 팝업 조건부 렌더링 */}
      {showModal && (
        <Popup
          title={
            write
              ? "작성한 일기가 저장되지 않아요!\n화면을 닫을까요?"
              : edit
              ? "수정한 일기가 저장되지 않아요!\n화면을 닫을까요?"
              : ""
          }
          buttons={[
            { label: "예", onClick: handleConfirm },
            { label: "아니오", onClick: handleCancel },
          ]}
        />
      )}
    </>
  );
};

export default Header;
