import React from "react";
import styles from "./HomePage.module.css";
import { useCharacter } from "../../contexts/CharacterContext";

export default function EmptyDiaryView() {
  const { character } = useCharacter();

  const bgMap: Record<string, string> = {
    momo: "/images/nodiary_home/momo/bg_momo.svg",
    boro: "/images/nodiary_home/boro/bg_boro.svg",
    lumi: "/images/nodiary_home/lumi/bg_lumi.svg",
    zuni: "/images/nodiary_home/zuni/bg_zuni.svg",
  };

  const characterImgMap: Record<string, string> = {
    momo: "/images/nodiary_home/momo/nodiary_momo.svg",
    boro: "/images/nodiary_home/boro/nodiary_boro.svg",
    lumi: "/images/nodiary_home/lumi/nodiary_lumi.svg",
    zuni: "/images/nodiary_home/zuni/nodiary_zuni.svg",
  };

  return (
    <div className={styles.emptyWrapper}>
      <img
        src="/images/nodiary_home/emptydiary_bubble.svg"
        className={styles.bubbleImg}
        alt="말풍선"
      />
      <div className={styles.emptyCharacter}>
        {character && (
          <>
            <div className={styles.characterBgContainer}>
              <img
                src={bgMap[character]}
                className={`${styles.characterBgIcon} ${styles.bg1}`}
                alt="배경 아이콘1"
              />
              <img
                src={bgMap[character]}
                className={`${styles.characterBgIcon} ${styles.bg2}`}
                alt="배경 아이콘2"
              />
              <img
                src={bgMap[character]}
                className={`${styles.characterBgIcon} ${styles.bg3}`}
                alt="배경 아이콘3"
              />
            </div>

            <img
              src={characterImgMap[character]}
              className={styles.character}
              alt="캐릭터"
            />
          </>
        )}
      </div>
    </div>
  );
}
