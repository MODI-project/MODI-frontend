import React, { useState } from "react";
import styles from "./ToggleSwitch.module.css";
import { useCharacter } from "../../contexts/CharacterContext";

const characterColorMap: Record<string, string> = {
  momo: "#FBD7D5",
  boro: "#FEE888",
  lumi: "#A7E1B6",
  zuni: "#93D1E0",
};

interface ToggleSwitchProps {
  isOn?: boolean;
  onToggle?: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn: externalIsOn,
  onToggle,
}) => {
  const [internalIsOn, setInternalIsOn] = useState(true); // 내부 상태 (기본값)
  const { character } = useCharacter();

  // 외부에서 isOn이 제공되면 사용, 아니면 내부 상태 사용
  const isOn = externalIsOn !== undefined ? externalIsOn : internalIsOn;

  const handleToggle = () => {
    if (onToggle) {
      // 외부에서 onToggle이 제공되면 외부 함수 호출
      onToggle();
    } else {
      // 내부 상태만 변경
      setInternalIsOn(!internalIsOn);
    }
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
