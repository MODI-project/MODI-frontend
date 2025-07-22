import React, { useState } from "react";
import styles from "./ToggleSwitch.module.css";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className={styles.toggle_container} onClick={handleToggle}>
      <div
        className={`${styles.toggle_switch} ${isOn ? styles.on : styles.off}`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
