import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Home,
    BookOpen,
    Brain,
    Trophy,
    User,
    LogOut,
    Target,
    Settings,
    GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            isActive
                ? "bg-[#58CC02] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
        }`;

    return (
        <div className="min-h-screen bg-[#F7FAFC]">
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-100 p-6 flex-col">
                <div className="mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#58CC02] flex items-center justify-center shadow-md">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black text-slate-800">
                                LinguaKid
                            </h1>
                            <p className="text-xs text-slate-400 font-semibold">
                                English Learning
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-6 flex-1">
                    <div>
                        <p className="px-4 text-xs font-black text-slate-400 mb-3">
                            LEARNING
                        </p>

                        <div className="space-y-2">
                            <NavLink to="/dashboard" className={navLinkClass}>
                                <Home className="w-5 h-5" />
                                Dashboard
                            </NavLink>

                            <NavLink to="/learn" className={navLinkClass}>
                                <GraduationCap className="w-5 h-5" />
                                Learn
                            </NavLink>

                            <NavLink to="/topics" className={navLinkClass}>
                                <BookOpen className="w-5 h-5" />
                                Topics
                            </NavLink>

                            <NavLink to="/quiz" className={navLinkClass}>
                                <Target className="w-5 h-5" />
                                Quiz
                            </NavLink>

                            <NavLink to="/quiz-results" className={navLinkClass}>
                                <Trophy className="w-5 h-5" />
                                My Results
                            </NavLink>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 font-bold cursor-not-allowed">
                                <Trophy className="w-5 h-5" />
                                Achievements
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 font-bold cursor-not-allowed">
                                <User className="w-5 h-5" />
                                Profile
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="px-4 text-xs font-black text-slate-400 mb-3">
                            MANAGEMENT
                        </p>

                        <div className="space-y-2">
                            <NavLink
                                to="/vocabularies"
                                className={navLinkClass}
                            >
                                <Brain className="w-5 h-5" />
                                Manage Vocabulary
                            </NavLink>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 font-bold cursor-not-allowed">
                                <Settings className="w-5 h-5" />
                                Admin Settings
                            </div>
                        </div>
                    </div>
                </nav>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </aside>

            <header className="lg:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#58CC02] flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>

                    <h1 className="text-xl font-black text-slate-800">
                        LinguaKid
                    </h1>
                </div>

                <button
                    onClick={handleLogout}
                    className="text-red-500 font-bold"
                >
                    Logout
                </button>
            </header>

            <main className="lg:ml-72 p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;