import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { register } from "../services/authService";

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
        <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10 dark:bg-slate-950">
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
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
                </Link>

                <form
                    onSubmit={handleRegister}
                    className="kid-panel p-8"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Create Account
                        </h2>

                        <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
                            Start your English learning journey
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-500 dark:bg-red-950/40">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-[#58CC02] dark:bg-green-950/40">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="register-name" className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                                Name
                            </label>

                            <div className="relative">
                                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="name"
                                    id="register-name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="kid-input py-4 pl-12 pr-4"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-email" className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="email"
                                    id="register-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="kid-input py-4 pl-12 pr-4"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-password" className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="password"
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="kid-input py-4 pl-12 pr-12"
                                    value={form.password}
                                    onChange={handleChange}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="kid-button kid-button-green mt-7 w-full py-4 disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-500 font-semibold">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#58CC02] font-black hover:underline"
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
