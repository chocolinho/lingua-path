import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { register } from "../services/authService";
import PreferenceControls from "../components/PreferenceControls";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (form.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            await register(form);

            setSuccessMessage("Register successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            console.error(error);
            setErrorMessage("Register failed. Email may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-10 dark:bg-slate-950">
            <div className="absolute right-4 top-4">
                <PreferenceControls compact />
            </div>
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
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
                </Link>

                <form
                    onSubmit={handleRegister}
                    className="ui-panel p-8"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Create Account
                        </h1>

                        <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
                            Start your English learning journey
                        </p>
                    </div>

                    {errorMessage && (
                        <div role="alert" className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-950/40 dark:text-red-200">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div role="status" aria-live="polite" className="mb-5 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="register-name" className="mb-2 block text-sm font-bold text-slate-600 dark:text-slate-300">
                                Name
                            </label>

                            <div className="relative">
                                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="name"
                                    id="register-name"
                                    type="text"
                                    placeholder="Enter your name"
                                    autoComplete="username"
                                    className="ui-input py-4 pl-12 pr-4"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-email" className="mb-2 block text-sm font-bold text-slate-600 dark:text-slate-300">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="email"
                                    id="register-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="ui-input py-4 pl-12 pr-4"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-password" className="mb-2 block text-sm font-bold text-slate-600 dark:text-slate-300">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="password"
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    className="ui-input py-4 pl-12 pr-12"
                                    value={form.password}
                                    onChange={handleChange}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="ui-button ui-button-primary mt-7 w-full py-4 disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-500 font-semibold">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center font-bold text-[#0F766E] hover:underline dark:text-teal-300"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
