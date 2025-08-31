import React, { useContext } from "react";
import {
  useCharacter,
  CharacterType,
} from "../../../../contexts/CharacterContext";
import style from "./Search.module.css";

import momoSvg from "/images/search-character/search_momo.svg";
import boroSvg from "/images/search-character/search_boro.svg";
import lumiSvg from "/images/search-character/search_lumi.svg";
import zuniSvg from "/images/search-character/search_zuni.svg";
import defaultSvg from "/images/search-character/search_momo.svg";

type Character = "momo" | "boro" | "lumi" | "zuni" | null;

const svgMap = new Map<Character, string>([
  ["momo", momoSvg],
  ["boro", boroSvg],
  ["lumi", lumiSvg],
  ["zuni", zuniSvg],
  [null, defaultSvg],
]);

export default function CharacterImage() {
  const { character } = useCharacter();
  if (!character) return null;

  const src = svgMap.get(character) ?? defaultSvg;

  const isSmall = character === "zuni";

  return (
    <div className={style.searchCharacterContainer}>
      <img
        src={src}
        alt={character ? `${character} 아이콘` : "기본 아이콘"}
        className={`${style.searchCharacterImage} ${
          isSmall ? style.smallSvg : ""
        }`}
      />
      <span className={style.text}>작성한 기록이 없습니다</span>
    </div>
  );
}
