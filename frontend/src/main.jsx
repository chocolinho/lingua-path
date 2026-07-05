import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@astryxdesign/core/reset.css";
import "./index.css";
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";
import App from "./App.jsx";
import AstryxThemeBridge from "./components/AstryxThemeBridge.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider>
            <AstryxThemeBridge>
                <LanguageProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </LanguageProvider>
            </AstryxThemeBridge>
        </ThemeProvider>
    </StrictMode>
);
