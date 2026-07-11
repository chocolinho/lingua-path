import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Brain,
    ExternalLink,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PreferenceControls from "../components/PreferenceControls";

const adminNavigation = [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/topics", label: "Topics", icon: BookOpen },
    { to: "/admin/vocabularies", label: "Vocabulary", icon: Brain },
    { to: "/dashboard", label: "Learner app", icon: ExternalLink },
];

function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const desktopNavClass = ({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
            isActive
                ? "bg-[var(--color-secondary)] text-[var(--color-on-secondary)] shadow-sm"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-secondary-soft)] hover:text-[var(--color-secondary)]"
        }`;

    const mobileNavClass = ({ isActive }) =>
        `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold transition-colors ${
            isActive
                ? "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]"
                : "text-[var(--color-text-muted)]"
        }`;

    return (
        <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-text)]">
            <a href="#main-content" className="skip-link">Skip to main content</a>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
                <div className="flex h-20 items-center gap-3 border-b border-[var(--color-border)] px-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary)] text-[var(--color-on-secondary)] shadow-sm">
                        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xl font-bold tracking-tight">LinguaPath</p>
                        <p className="truncate text-xs font-semibold text-[var(--color-text-muted)]">Administration</p>
                    </div>
                </div>

                <div className="border-b border-[var(--color-border)] p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-subtle)] p-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                            <UserRound className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{user?.username || user?.email || "Admin"}</p>
                            <p className="text-xs font-semibold text-[var(--color-text-muted)]">System administrator</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
                    {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} className={desktopNavClass}>
                                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-[var(--color-border)] p-3">
                    <div className="mb-2 px-1"><PreferenceControls /></div>
                    <button type="button" onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--color-danger)] transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">
                        <LogOut className="h-5 w-5" aria-hidden="true" />
                        Log out
                    </button>
                </div>
            </aside>

            <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur lg:hidden">
                <div className="flex min-h-16 items-center justify-between gap-3 px-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary)] text-[var(--color-on-secondary)]">
                            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-bold">Admin console</p>
                            <p className="truncate text-xs font-semibold text-[var(--color-text-muted)]">{user?.username || user?.email || "Admin"}</p>
                        </div>
                    </div>
                    <PreferenceControls compact />
                </div>
            </header>

            <main id="main-content" tabIndex={-1} className="px-4 py-5 pb-28 sm:px-6 md:py-7 lg:ml-64 lg:px-8 lg:pb-8">
                <Outlet />
            </main>

            <nav className="safe-area-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-1 pt-1.5 backdrop-blur lg:hidden" aria-label="Mobile admin navigation">
                {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.to} to={item.to} className={mobileNavClass}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}

export default AdminLayout;
