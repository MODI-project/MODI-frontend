import React, { createContext, useContext, useEffect, useState } from "react";
import { loadUserInfo } from "../apis/UserAPIS/loadUserInfo";

export type CharacterType = "momo" | "boro" | "lumi" | "zuni" | null;

type Ctx = {
  character: CharacterType;
  nickname: string | null;
  setCharacter: (c: CharacterType) => void;
  setNickname: (n: string | null) => void;
  refreshFromServer: () => Promise<void>;
};

const CharacterContext = createContext<Ctx>({
  character: null,
  nickname: null,
  setCharacter: () => {},
  setNickname: () => {},
  refreshFromServer: async () => {},
});

export const CharacterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [character, setCharacter] = useState<CharacterType>(() => {
    const init = (localStorage.getItem("character") as CharacterType) || null;
    return init;
  });
  const [nickname, setNickname] = useState<string | null>(() => {
    const init = localStorage.getItem("nickname");
    return init;
  });

  // setter + 로컬스토리지 동기화 + 로그
  const saveCharacter = (c: CharacterType) => {
    setCharacter(c);
    if (c) {
      localStorage.setItem("character", c);
    } else {
      localStorage.removeItem("character");
    }
  };
  const saveNickname = (n: string | null) => {
    setNickname(n);
    if (n) {
      localStorage.setItem("nickname", n);
    } else {
      localStorage.removeItem("nickname");
    }
  };

  const refreshFromServer = async () => {
    try {
      const me = await loadUserInfo();
      saveCharacter(me.character);
      saveNickname(me.nickname);
    } catch (e) {
      // 로그인되지 않은 상태이므로 로컬 스토리지 값 유지
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        nickname,
        setCharacter: saveCharacter,
        setNickname: saveNickname,
        refreshFromServer,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);
