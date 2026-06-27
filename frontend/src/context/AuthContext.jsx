import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    const loginSuccess = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        if (!localStorage.getItem("token")) {
            setUser(null);
            return null;
        }

        try {
            setLoadingUser(true);
            const data = await getCurrentUser();
            setUser(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch current user", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            }
            return null;
        } finally {
            setLoadingUser(false);
        }
    }, [logout]);

    useEffect(() => {
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCurrentUser();
        } else {
            setUser(null);
        }
    }, [token, fetchCurrentUser]);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loadingUser,
                isAuthenticated,
                loginSuccess,
                logout,
                fetchCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
