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
import PreferenceControls from "../components/PreferenceControls";

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
        <div className="relative flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-10 dark:bg-slate-950">
            <div className="absolute right-4 top-4">
                <PreferenceControls compact />
            </div>
            <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
                <div className="hidden lg:block">
                    <Link to="/" className="mb-8 inline-flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-green-200 bg-[#0F766E] text-white shadow-sm dark:border-green-900 dark:shadow-none">
                            <BookOpen className="h-8 w-8" />
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                LinguaPath
                            </p>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning Platform
                            </p>
                        </div>
                    </Link>

                    <div className="ui-panel-accent p-8">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2 font-bold text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                            <Sparkles className="h-5 w-5" />
                            Focused English practice
                        </div>

                        <h2 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                            Welcome back,
                            <span className="block text-[#0F766E]">
                                keep building confidence.
                            </span>
                        </h2>

                        <p className="mt-5 text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                            Continue your learning plan, review useful vocabulary,
                            and strengthen recall through focused practice.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="ui-card p-5">
                                <p className="text-3xl font-bold text-orange-500">
                                    Learn
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Vocabulary
                                </p>
                            </div>

                            <div className="ui-card p-5">
                                <p className="text-3xl font-bold text-yellow-500">
                                    Practice
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Quizzes
                                </p>
                            </div>

                            <div className="ui-card p-5">
                                <p className="text-3xl font-bold text-purple-500">
                                    Review
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Mistakes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm dark:shadow-none">
                            <BookOpen className="h-8 w-8" />
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                LinguaPath
                            </p>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="ui-panel p-7 md:p-8"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Login
                            </h1>

                            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
                                Continue your learning adventure
                            </p>
                        </div>

                        {errorMessage && (
                            <div role="alert" className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-950/40 dark:text-red-200">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-slate-600 dark:text-slate-300">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        className="ui-input py-4 pl-12 pr-4"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="mb-2 block text-sm font-bold text-slate-600 dark:text-slate-300">
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
                                        className="ui-input py-4 pl-12 pr-12"
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
                                        className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
                            <label className="flex min-h-11 cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="h-5 w-5 accent-[#0F766E]"
                                />

                                <span className="text-sm font-bold text-slate-500">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="ui-button ui-button-primary mt-7 w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500 font-semibold">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="inline-flex min-h-11 items-center font-bold text-[#0F766E] hover:underline dark:text-teal-300"
                                >
                                    Register now
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="inline-flex min-h-11 items-center text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
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
