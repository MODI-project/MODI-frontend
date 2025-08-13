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
    console.log("[CharacterProvider:init] localStorage.character =", init);
    return init;
  });
  const [nickname, setNickname] = useState<string | null>(() => {
    const init = localStorage.getItem("nickname");
    console.log("[CharacterProvider:init] localStorage.nickname =", init);
    return init;
  });

  // setter + 로컬스토리지 동기화 + 로그
  const saveCharacter = (c: CharacterType) => {
    console.log("[CharacterProvider:setCharacter] new =", c);
    setCharacter(c);
    if (c) {
      localStorage.setItem("character", c);
    } else {
      localStorage.removeItem("character");
    }
    console.log(
      "[CharacterProvider:setCharacter] localStorage.character =",
      localStorage.getItem("character")
    );
  };
  const saveNickname = (n: string | null) => {
    console.log("[CharacterProvider:setNickname] new =", n);
    setNickname(n);
    if (n) {
      localStorage.setItem("nickname", n);
    } else {
      localStorage.removeItem("nickname");
    }
    console.log(
      "[CharacterProvider:setNickname] localStorage.nickname =",
      localStorage.getItem("nickname")
    );
  };

  const refreshFromServer = async () => {
    console.log("[CharacterProvider:refreshFromServer] start");
    try {
      const me = await loadUserInfo();
      console.log("[CharacterProvider:refreshFromServer] success:", me);
      saveCharacter(me.character);
      saveNickname(me.nickname);
    } catch (e) {
      console.warn("[CharacterProvider:refreshFromServer] failed:", e);
    }
  };

  useEffect(() => {
    refreshFromServer();
  }, []);

  useEffect(() => {
    console.log(
      "[CharacterProvider:state] character =",
      character,
      "/ nickname =",
      nickname
    );
  }, [character, nickname]);

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
