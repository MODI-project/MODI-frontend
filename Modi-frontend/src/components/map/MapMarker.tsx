import styles from "./MapMarker.module.css";

const MapMarker = () => {
  return (
    <div className={styles.mapMarker_container}>
      <div className={styles.post_counts_container}>
        <span className={styles.post_counts}>+n</span>
      </div>
    </div>
  );
};

export default MapMarker;
