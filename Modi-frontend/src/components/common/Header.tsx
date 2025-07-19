import styles from "./Header.module.css";

interface HeaderProps {
  left?: string;
  middle?: string;
  right?: string;
}

const Header = ({ left, middle, right }: HeaderProps) => {
  return (
    <div className={styles.header_wrapper}>
      <div className={styles.header_container}>
        {left ? <img src={left} /> : <div></div>}
        {middle ? <span className={styles.func}>{middle}</span> : <div></div>}
        {right ? <img src={right} /> : <div></div>}
      </div>
    </div>
  );
};

export default Header;
