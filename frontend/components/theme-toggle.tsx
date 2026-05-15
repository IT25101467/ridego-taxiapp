"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className=" flex items-center gap-2
        px-4 py-2 rounded-xl
        bg-blue-900/40
        dark:bg-slate-800
        text-blue-100
        border border-blue-800
        dark:border-slate-700
        hover:bg-blue-800
        dark:hover:bg-slate-700
        transition-all duration-300
        shadow-lg"
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}