"use client";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("ghostos-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    if (saved === "light") {
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);
  return <>{children}</>;
}
