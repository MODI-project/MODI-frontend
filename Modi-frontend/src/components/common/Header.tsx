import styles from "./Header.module.css";

interface HeaderProps {
  left?: string;
  LeftClick?: () => void;
  middle?: string;
  right?: string;
  RightClick?: () => void;
}

const Header = ({
  left,
  LeftClick,
  middle,
  right,
  RightClick,
}: HeaderProps) => {
  return (
    <>
      <div className={styles.header_wrapper}>
        <div className={styles.header_container}>
          {left ? (
            <img className={styles.button} src={left} onClick={LeftClick} />
          ) : (
            <div></div>
          )}
          {middle ? <span className={styles.func}>{middle}</span> : <div></div>}
          {right ? (
            <img className={styles.button} src={right} onClick={RightClick} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
