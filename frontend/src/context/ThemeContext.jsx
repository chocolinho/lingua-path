import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();
const THEME_STORAGE_KEY = "theme";

function getInitialTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("dark", theme === "dark");
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        const syncTheme = (event) => {
            if (
                event.key === THEME_STORAGE_KEY &&
                (event.newValue === "light" || event.newValue === "dark")
            ) {
                setTheme(event.newValue);
            }
        };

        window.addEventListener("storage", syncTheme);
        return () => window.removeEventListener("storage", syncTheme);
    }, []);

    const value = useMemo(
        () => ({
            theme,
            isDark: theme === "dark",
            setTheme,
            toggleTheme: () =>
                setTheme((currentTheme) =>
                    currentTheme === "dark" ? "light" : "dark"
                ),
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext);
}
