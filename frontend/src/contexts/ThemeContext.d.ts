import * as React from "react";
type Theme = "light" | "dark";
type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
};
export declare const ThemeProvider: React.FC<{
    defaultTheme?: Theme;
    children?: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextValue;
export default ThemeProvider;
