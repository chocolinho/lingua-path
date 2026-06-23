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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-yellow-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="flex items-center justify-center gap-3 mb-8"
                >
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
                </Link>

                <form
                    onSubmit={handleRegister}
                    className="bg-white rounded-[2rem] shadow-2xl p-8 border border-white"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-800">
                            Create Account
                        </h2>

                        <p className="text-slate-400 font-semibold mt-2">
                            Start your English learning journey
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mb-5 bg-red-50 text-red-500 rounded-2xl px-4 py-3 text-sm font-bold">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-5 bg-green-50 text-[#58CC02] rounded-2xl px-4 py-3 text-sm font-bold">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-black text-slate-600 mb-2">
                                Name
                            </label>

                            <div className="relative">
                                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-semibold outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-600 mb-2">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-semibold outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                                    value={form.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 font-semibold outline-none focus:border-[#58CC02] focus:ring-4 focus:ring-green-100 transition-all"
                                    value={form.password}
                                    onChange={handleChange}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-7 bg-[#58CC02] text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60"
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