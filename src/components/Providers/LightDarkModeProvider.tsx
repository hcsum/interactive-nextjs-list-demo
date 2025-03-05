"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type Mode = "light" | "dark";

type LightDarkModeContextType = {
  mode: Mode;
  toggleMode: () => void;
};

const LightDarkModeContext = createContext<
  LightDarkModeContextType | undefined
>(undefined);

export function LightDarkModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("light");

  const toggleMode = useCallback(() => {
    const newTheme = mode === "dark" ? "light" : "dark";
    setMode(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [mode]);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setMode(savedTheme === "dark" ? "dark" : "light");
  }, []);

  return (
    <LightDarkModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </LightDarkModeContext.Provider>
  );
}

export function useLightDarkMode() {
  const context = useContext(LightDarkModeContext);
  if (context === undefined) {
    throw new Error(
      "useLightDarkMode must be used within a LightDarkModeProvider",
    );
  }
  return context;
}
