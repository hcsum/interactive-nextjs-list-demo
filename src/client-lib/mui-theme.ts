"use client";

import { createTheme } from "@mui/material/styles";

const theme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode, // Dynamically set the mode to either light or dark
      primary: {
        main: "#3b82f6", // Tailwind's blue-500 color or any color of your choice
      },
      secondary: {
        main: "#9333ea", // Tailwind's purple-500 color or any color of your choice
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif", // Tailwind's default font family (you can use any available font)
    },
  });

export default theme;
