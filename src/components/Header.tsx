"use client";

import React, { useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useLightDarkMode } from "./Providers/LightDarkModeProvider";

const Header: React.FC = () => {
  const { mode, toggleMode } = useLightDarkMode();

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <header className="bg-white shadow py-4 px-6 dark:bg-gray-800 relative">
      <div className="mx-auto lg:max-w-[90%] flex justify-between items-center">
        <p className="text-2xl font-bold text-black dark:text-white font-signika">
          Interactive List Demo
        </p>
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {mode === "dark" ? (
              <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
