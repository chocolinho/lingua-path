import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function PreferenceControls({ compact = false }) {
    const { isDark, toggleTheme } = useTheme();
    const targetTheme = isDark ? "light" : "dark";

    const baseButtonClass = compact
        ? "inline-flex h-11 w-11 items-center justify-center rounded-xl"
        : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold";
    const themeButtonClass = `${baseButtonClass} border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-teal-300 dark:hover:bg-slate-700 dark:hover:text-teal-200`;

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggleTheme}
                className={themeButtonClass}
                aria-label={`Switch to ${targetTheme} mode`}
                aria-pressed={isDark}
                title={`Switch to ${targetTheme} mode`}
            >
                {isDark ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
                {!compact && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
            </button>
        </div>
    );
}

export default PreferenceControls;
