"use client";

import { createContext, useContext } from "react";

/* Fixed hybrid mode — no dark/light toggle. This context is kept
   for backward compatibility with any component that imports useTheme. */

const ThemeContext = createContext<{
  theme: "light";
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "light", toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
