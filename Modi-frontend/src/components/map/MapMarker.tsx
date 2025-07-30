import styles from "./MapMarker.module.css";

const MapMarker = () => {
  return (
    <div className={styles.mapMarker_container}>
      <img
        className={styles.character_image}
        src="/images/map-marker/momo-marker/happy-momo-marker.svg"
        alt="행복한 모모"
      />
      <span className={styles.post_counts}>+n</span>
    </div>
  );
};

export default MapMarker;
