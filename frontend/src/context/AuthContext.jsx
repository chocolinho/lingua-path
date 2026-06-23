import { createContext, useContext, useEffect, useState } from "react";
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

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const fetchCurrentUser = async () => {
        if (!localStorage.getItem("token")) return;

        try {
            setLoadingUser(true);
            const data = await getCurrentUser();
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch current user", error);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

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

export function useAuth() {
    return useContext(AuthContext);
}