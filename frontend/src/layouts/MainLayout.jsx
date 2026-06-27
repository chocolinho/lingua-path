import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Brain,
    GraduationCap,
    Home,
    LogOut,
    Sparkles,
    Target,
    Trophy,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
    const { logout, user, loadingUser } = useAuth();
    const navigate = useNavigate();

    const displayName = user?.username || user?.email || "Learner";
    const totalXp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const levelProgress = Math.min(user?.levelProgress ?? 0, 100);
    const nextLevelXp = user?.nextLevelXp ?? 100;

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: Home },
        { to: "/learn", label: "Learn", icon: GraduationCap },
        { to: "/quiz", label: "Quiz", icon: Target },
        { to: "/quiz-results", label: "Results", icon: Trophy },
        { to: "/topics", label: "Topics", icon: BookOpen },
        { to: "/vocabularies", label: "Words", icon: Brain },
    ];

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all ${
            isActive
                ? "bg-[#58CC02] text-white shadow-lg shadow-green-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <div className="min-h-screen bg-[#F6F8FB] text-slate-800">
            <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-slate-100 bg-white p-6 lg:flex">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58CC02] shadow-lg shadow-green-100">
                        <BookOpen className="h-7 w-7 text-white" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            LinguaKid
                        </h1>
                        <p className="text-xs font-bold text-slate-400">
                            English Learning
                        </p>
                    </div>
                </div>

                <div className="mb-7 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1CB0F6] shadow-sm">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800">
                                {loadingUser ? "Loading..." : displayName}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                                Level {level} · {totalXp} XP
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-400">
                        {totalXp} / {nextLevelXp} XP
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={navLinkClass}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-black text-red-500 transition-all hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </aside>

            <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#58CC02]">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-black text-slate-900">
                                LinguaKid
                            </h1>
                            <p className="truncate text-xs font-bold text-slate-400">
                                {displayName} · Level {level}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-2xl bg-red-50 p-3 text-red-500"
                        aria-label="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-yellow-500" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>
                    <span className="text-xs font-black text-slate-500">
                        {totalXp} XP
                    </span>
                </div>
            </header>

            <main className="px-4 py-5 pb-24 md:px-8 md:py-8 lg:ml-72 lg:pb-8">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 gap-1 border-t border-slate-100 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
                {navItems.slice(0, 4).map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition-all ${
                                    isActive
                                        ? "bg-green-50 text-[#58CC02]"
                                        : "text-slate-400"
                                }`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}

export default MainLayout;
