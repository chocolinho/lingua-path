import { Theme as AstryxTheme } from "@astryxdesign/core";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import { useTheme } from "../context/ThemeContext";

function AstryxThemeBridge({ children }) {
    const { theme } = useTheme();

    return (
        <AstryxTheme theme={neutralTheme} mode={theme}>
            {children}
        </AstryxTheme>
    );
}

export default AstryxThemeBridge;
