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

            const data = await login(email, password);

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            loginSuccess(data.token);
            navigate("/dashboard");
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-yellow-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                <div className="hidden lg:block">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-800">
                                LinguaKid
                            </h1>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning Platform
                            </p>
                        </div>
                    </Link>

                    <div className="bg-white/70 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-xl border border-white">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-[#58CC02] px-4 py-2 rounded-full font-black mb-6">
                            <Sparkles className="w-5 h-5" />
                            Learn English the fun way
                        </div>

                        <h2 className="text-5xl font-black text-slate-800 leading-tight">
                            Welcome back,
                            <span className="block text-[#58CC02]">
                                young learner!
                            </span>
                        </h2>

                        <p className="text-slate-500 text-lg mt-5 leading-relaxed">
                            Continue your English journey, collect XP, unlock
                            badges, and keep your daily streak alive.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white rounded-3xl p-5 shadow-sm">
                                <p className="text-3xl font-black text-orange-500">
                                    3
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Day streak
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-5 shadow-sm">
                                <p className="text-3xl font-black text-yellow-500">
                                    120
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    XP points
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-5 shadow-sm">
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
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-800">
                                LinguaKid
                            </h1>
                            <p className="text-sm font-bold text-slate-400">
                                English Learning
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="bg-white rounded-[2rem] shadow-2xl p-7 md:p-8 border border-white"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-800">
                                Login
                            </h2>

                            <p className="text-slate-400 font-semibold mt-2">
                                Continue your learning adventure
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="mb-5 bg-red-50 text-red-500 rounded-2xl px-4 py-3 text-sm font-bold">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-black text-slate-600 mb-2">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-semibold outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-600 mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 font-semibold outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
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

                            <Link
                                to="/forgot-password"
                                className="text-sm font-black text-[#1CB0F6] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-7 bg-[#58CC02] text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
