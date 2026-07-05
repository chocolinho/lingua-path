import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Sparkles,
} from "lucide-react";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
    const rememberedEmail = localStorage.getItem("rememberedEmail") || "";
    const [email, setEmail] = useState(rememberedEmail);
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { loginSuccess } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const normalizedEmail = email.trim();
            const data = await login(normalizedEmail, password);

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", normalizedEmail);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            loginSuccess(data.token);
            navigate(data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                setErrorMessage("Email or password is incorrect.");
            } else if (error.response?.status === 404) {
                setErrorMessage("Login API not found. Please check backend endpoint.");
            } else if (error.code === "ERR_NETWORK") {
                setErrorMessage("Cannot connect to backend server.");
            } else {
                setErrorMessage("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 dark:bg-slate-950">
            <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
                <div className="hidden lg:block">
                    <Link to="/" className="mb-8 inline-flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] border-2 border-green-200 bg-[#58CC02] text-white shadow-[0_5px_0_#46a302] dark:border-green-900 dark:shadow-none">
                            <BookOpen className="h-8 w-8" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                LinguaKid
                            </h1>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning Platform
                            </p>
                        </div>
                    </Link>

                    <div className="kid-panel-soft p-8">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2 font-black text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                            <Sparkles className="h-5 w-5" />
                            Learn English the fun way
                        </div>

                        <h2 className="text-5xl font-black leading-tight text-slate-900 dark:text-white">
                            Welcome back,
                            <span className="block text-[#58CC02]">
                                young learner!
                            </span>
                        </h2>

                        <p className="mt-5 text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                            Continue your English journey, collect XP, unlock
                            badges, and keep your daily streak alive.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="kid-card p-5">
                                <p className="text-3xl font-black text-orange-500">
                                    3
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Day streak
                                </p>
                            </div>

                            <div className="kid-card p-5">
                                <p className="text-3xl font-black text-yellow-500">
                                    120
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    XP points
                                </p>
                            </div>

                            <div className="kid-card p-5">
                                <p className="text-3xl font-black text-purple-500">
                                    8
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Badges
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[#58CC02] text-white shadow-[0_5px_0_#46a302] dark:shadow-none">
                            <BookOpen className="h-8 w-8" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                LinguaKid
                            </h1>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="kid-panel p-7 md:p-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                Login
                            </h2>

                            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
                                Continue your learning adventure
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500 dark:bg-red-950/40">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        className="kid-input py-4 pl-12 pr-4"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                    <input
                                        id="login-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="kid-input py-4 pl-12 pr-12"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="w-4 h-4 accent-[#58CC02]"
                                />

                                <span className="text-sm font-bold text-slate-500">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="kid-button kid-button-green mt-7 w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500 font-semibold">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-[#58CC02] font-black hover:underline"
                                >
                                    Register now
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="text-sm font-bold text-slate-400 hover:text-slate-600"
                            >
                                Back to home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
