import React, { createContext, useContext, useState } from "react";
import useLoadUserInfo, { MeResponse } from "../apis/UserAPIS/loadUserInfo";

export type CharacterType = "momo" | "boro" | "lumi" | "zuni" | null;

type Ctx = {
  character: CharacterType;
  nickname: string | null;
  setCharacter: (c: CharacterType) => void;
  setNickname: (n: string | null) => void;
  refreshFromServer: () => Promise<void>;
};

const CharacterContext = createContext<Ctx>({
  character: "momo", // ✅ 기본값 momo
  nickname: null,
  setCharacter: () => {},
  setNickname: () => {},
  refreshFromServer: async () => {},
});

export const CharacterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { fetchUserInfo } = useLoadUserInfo();
  const [character, setCharacter] = useState<CharacterType>(() => {
    const init = (localStorage.getItem("character") as CharacterType) || "momo"; // ✅ 기본값 momo
    return init;
  });
  const [nickname, setNickname] = useState<string | null>(() => {
    const init = localStorage.getItem("nickname");
    return init;
  });

  // setter + 로컬스토리지 동기화
  const saveCharacter = (c: CharacterType) => {
    setCharacter(c ?? "momo"); // ✅ null 들어오면 momo로
    if (c) {
      localStorage.setItem("character", c);
    } else {
      localStorage.setItem("character", "momo"); // ✅ 기본값 저장
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
      const me: MeResponse = await fetchUserInfo();
      saveCharacter(me.character ?? "momo"); // ✅ 없으면 momo
      saveNickname(me.nickname);
    } catch (e) {
      // 로그인 안 된 경우 → 최소 momo 유지
      if (!character) {
        saveCharacter("momo");
      }
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
