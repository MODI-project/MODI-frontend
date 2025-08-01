import React, { useState } from "react";
import styles from "./ToggleSwitch.module.css";
import { useCharacter } from "../../contexts/CharacterContext";

const characterColorMap: Record<string, string> = {
  momo: "#FBD7D5",
  boro: "#FEE888",
  lumi: "#A7E1B6",
  zuni: "#93D1E0",
};

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(true); // 알림 켜져있는게 기본값
  const { character } = useCharacter();

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  const charColor = characterColorMap[character ?? "momo"];

  return (
    <div
      className={styles.toggle_container}
      style={{ "--character-color": charColor } as React.CSSProperties}
      onClick={handleToggle}
    >
      <div
        className={`${styles.toggle_switch} ${isOn ? styles.on : styles.off}`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
