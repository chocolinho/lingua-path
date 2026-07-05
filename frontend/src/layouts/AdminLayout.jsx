import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Home,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PreferenceControls from "../components/PreferenceControls";
import { useLanguage } from "../context/LanguageContext";

function AdminLayout() {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900 ${
            isActive
                ? "bg-[#1CB0F6] text-white shadow-[0_4px_0_#118ac4] dark:shadow-none"
                : "text-slate-600 hover:bg-sky-100 hover:text-[#1CB0F6] dark:text-slate-300 dark:hover:bg-sky-950/60"
        }`;

    return (
        <div className="min-h-screen bg-[#F6F8FB] text-slate-800 dark:bg-slate-950 dark:text-slate-50">
            <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-sky-100 bg-[#FFFDF4] p-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] border-2 border-sky-200 bg-[#1CB0F6] text-white shadow-[0_5px_0_#118ac4] dark:border-sky-900 dark:shadow-none">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                            Admin
                        </h1>
                        <p className="text-xs font-bold text-slate-400">
                            LinguaKid Console
                        </p>
                    </div>
                </div>

                <div className="mb-5">
                    <PreferenceControls />
                </div>

                <div className="mb-7 rounded-[1.5rem] border-2 border-sky-100 bg-sky-50/80 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1CB0F6] shadow-sm dark:bg-slate-900">
                            <UserRound className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800 dark:text-white">
                                {user?.username || user?.email || "Admin"}
                            </p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {user?.role || "ADMIN"}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2" aria-label="Admin navigation">
                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="h-5 w-5" />
                        {t("dashboard")}
                    </NavLink>
                    <NavLink to="/admin/analytics" className={navLinkClass}>
                        <BarChart3 className="h-5 w-5" />
                        {t("analytics")}
                    </NavLink>
                    <NavLink to="/admin/topics" className={navLinkClass}>
                        <BookOpen className="h-5 w-5" />
                        {t("topics")}
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <Home className="h-5 w-5" />
                        User App
                    </NavLink>
                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-black text-red-500 transition-all hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 dark:hover:bg-red-950/40"
                >
                    <LogOut className="h-5 w-5" />
                    {t("logout")}
                </button>
            </aside>

            <header className="sticky top-0 z-20 border-b border-sky-100 bg-[#FFFDF4]/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1CB0F6]">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 dark:text-white">
                                Admin Console
                            </h1>
                            <p className="text-xs font-bold text-slate-400">
                                {user?.username || user?.email || "Admin"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PreferenceControls compact />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-2xl bg-red-50 p-3 text-red-500 dark:bg-red-950/40"
                            aria-label={t("logout")}
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <nav className="mt-3 grid grid-cols-4 gap-2" aria-label="Mobile admin navigation">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                            }`
                        }
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t("admin")}
                    </NavLink>
                    <NavLink
                        to="/admin/analytics"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                            }`
                        }
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t("analytics")}
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <Home className="h-4 w-4" />
                        App
                    </NavLink>
                    <NavLink
                        to="/admin/topics"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold ${
                                isActive
                                    ? "bg-sky-50 text-[#1CB0F6]"
                                    : "bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                            }`
                        }
                    >
                        <BookOpen className="h-4 w-4" />
                        {t("topics")}
                    </NavLink>
                </nav>
            </header>

            <main className="px-4 py-5 md:px-8 md:py-8 lg:ml-72">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
