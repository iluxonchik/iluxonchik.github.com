import { useContext } from "react";
import {
  ThemeProviderContext,
  ThemeProviderState,
} from "../contexts/ThemeContext";

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return {
    ...context,
    setTheme: (theme: string) => {
      // Always set to 'light' regardless of the input
      context.setTheme("light");
    },
  };
}
