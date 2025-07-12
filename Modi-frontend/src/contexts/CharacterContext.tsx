import React, { createContext, useState, useContext, ReactNode } from "react";

export type CharacterType = "momo" | "boro" | "lumi" | "zuni" | null;

interface ContextValue {
  character: CharacterType;
  setCharacter: (c: CharacterType) => void;
}

const CharacterContext = createContext<ContextValue>({
  character: null,
  setCharacter: () => {},
});

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<CharacterType>(
    () => (localStorage.getItem("character") as CharacterType) || null
  );

  const saveCharacter = (c: CharacterType) => {
    setCharacter(c);
    if (c) localStorage.setItem("character", c);
    else localStorage.removeItem("character");
  };

  return (
    <CharacterContext.Provider
      value={{ character, setCharacter: saveCharacter }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  return useContext(CharacterContext);
}
