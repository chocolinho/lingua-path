import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Brain,
    ChevronRight,
    CircleUserRound,
    Crown,
    Flame,
    GraduationCap,
    Heart,
    Home,
    LibraryBig,
    LogOut,
    Menu,
    MessageCircle,
    Receipt,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import PreferenceControls from "../components/PreferenceControls";

function MainLayout() {
    const { logout, user, loadingUser, isPremium } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const menuPanelRef = useRef(null);

    const displayName = user?.username || user?.email || "Learner";
    const totalXp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const levelProgress = Math.min(Math.max(user?.levelProgress ?? 0, 0), 100);
    const nextLevelXp = user?.nextLevelXp ?? 100;
    const isAdmin = user?.role === "ADMIN";
    const planLabel = isPremium ? t("premiumPlan") : t("freePlan");

    const primaryNavItems = [
        { to: "/dashboard", label: t("dashboard"), icon: Home },
        { to: "/learn", label: t("learn"), icon: GraduationCap },
        { to: "/quiz", label: t("quiz"), icon: Target },
        { to: "/vocabularies", label: t("words"), icon: Brain },
        { to: "/ranking", label: t("ranking"), icon: Trophy },
    ];

    const navigationGroups = [
        {
            label: "Your progress",
            items: [
                { to: "/analytics", label: t("analytics"), icon: BarChart3 },
                { to: "/achievements", label: t("badges"), icon: Flame },
                { to: "/quiz-results", label: t("results"), icon: Trophy },
                { to: "/review", label: t("review"), icon: Sparkles },
            ],
        },
        {
            label: "Library",
            items: [
                { to: "/topics", label: t("topics"), icon: LibraryBig },
                { to: "/favorites", label: t("favorites"), icon: Heart },
                { to: "/ai-tutor", label: "AI Tutor", icon: MessageCircle },
            ],
        },
        {
            label: "Account",
            items: [
                { to: "/profile", label: t("profile"), icon: CircleUserRound },
                { to: "/premium", label: t("premium"), icon: Crown },
                { to: "/payments", label: t("payments"), icon: Receipt },
                ...(isAdmin
                    ? [{ to: "/admin/dashboard", label: t("admin"), icon: ShieldCheck }]
                    : []),
            ],
        },
    ];

    const mobilePrimaryItems = primaryNavItems.slice(0, 4);
    const mobileMoreItems = [
        primaryNavItems[4],
        ...navigationGroups.flatMap((group) => group.items),
    ];
    const mobileMoreActive = mobileMoreItems.some((item) =>
        pathname === item.to || pathname.startsWith(`${item.to}/`)
    );
    const allItems = [...primaryNavItems, ...mobileMoreItems];
    const currentItem = allItems
        .sort((a, b) => b.to.length - a.to.length)
        .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    useEffect(() => {
        if (!mobileMenuOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.requestAnimationFrame(() => {
            menuPanelRef.current?.querySelector("a, button")?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = Array.from(
                menuPanelRef.current?.querySelectorAll(
                    'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                ) || []
            );
            if (!focusableElements.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const desktopNavLinkClass = ({ isActive }) =>
        `group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
            isActive
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-slate-600 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-teal-950/60 dark:hover:text-teal-100"
        }`;

    return (
        <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-text)]">
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:flex lg:flex-col">
                <div className="flex h-20 items-center gap-3 border-b border-[var(--color-border)] px-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
                        <BookOpen className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl font-bold tracking-tight">LinguaPath</p>
                        <p className="truncate text-xs font-semibold text-[var(--color-text-muted)]">
                            Learn with direction
                        </p>
                    </div>
                </div>

                <div className="border-b border-[var(--color-border)] p-4">
                    <div className="rounded-xl bg-[var(--color-surface-subtle)] p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                                <CircleUserRound className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold">
                                    {loadingUser ? t("loading") : displayName}
                                </p>
                                <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                                    Level {level} · {planLabel}
                                </p>
                            </div>
                            <NavLink
                                to="/profile"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                                aria-label="Open profile"
                            >
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </NavLink>
                        </div>
                        <div
                            className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
                            role="progressbar"
                            aria-label="Level progress"
                            aria-valuenow={levelProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full rounded-full bg-brand transition-[width] duration-300"
                                style={{ width: `${levelProgress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
                            {totalXp} / {nextLevelXp} XP
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <nav aria-label="Main navigation">
                        <div className="space-y-1">
                            {primaryNavItems.map((item) => (
                                <NavigationLink
                                    key={item.to}
                                    item={item}
                                    className={desktopNavLinkClass}
                                />
                            ))}
                        </div>

                        {navigationGroups.map((group) => (
                            <div key={group.label} className="mt-6">
                                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                                    {group.label}
                                </p>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <NavigationLink
                                            key={item.to}
                                            item={item}
                                            className={desktopNavLinkClass}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-[var(--color-border)] p-3">
                    <div className="mb-2 px-1">
                        <PreferenceControls />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--color-danger)] transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        <LogOut className="h-5 w-5" aria-hidden="true" />
                        {t("logout")}
                    </button>
                </div>
            </aside>

            <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur lg:hidden">
                <div className="flex min-h-16 items-center justify-between gap-3 px-4">
                    <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3 rounded-xl">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                            <BookOpen className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-base font-bold">LinguaPath</span>
                            <span className="block truncate text-xs font-semibold text-[var(--color-text-muted)]">
                                {currentItem?.label || "Learning workspace"}
                            </span>
                        </span>
                    </NavLink>
                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-1.5 rounded-full bg-[var(--color-surface-subtle)] px-3 py-2 text-sm font-bold sm:flex">
                            <Flame className="h-4 w-4 text-[var(--color-warning)]" aria-hidden="true" />
                            {user?.dailyStreak ?? 0}
                            <span className="sr-only">day streak</span>
                        </div>
                        <NavLink
                            to="/profile"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                            aria-label="Open profile"
                        >
                            <CircleUserRound className="h-5 w-5" aria-hidden="true" />
                        </NavLink>
                    </div>
                </div>
            </header>

            <main
                id="main-content"
                tabIndex={-1}
                className="px-4 py-5 pb-28 sm:px-6 md:py-7 lg:ml-64 lg:px-8 lg:pb-8"
            >
                <Outlet />
            </main>

            <nav
                className="safe-area-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-1 pt-1.5 backdrop-blur lg:hidden"
                aria-label="Primary mobile navigation"
            >
                {mobilePrimaryItems.map((item) => (
                    <NavigationLink
                        key={item.to}
                        item={item}
                        className={({ isActive }) =>
                            `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold transition-colors ${
                                isActive
                                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]"
                                    : "text-[var(--color-text-muted)]"
                            }`
                        }
                    />
                ))}
                <button
                    ref={menuButtonRef}
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold transition-colors ${
                        mobileMoreActive
                            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]"
                            : "text-[var(--color-text-muted)]"
                    }`}
                    aria-haspopup="dialog"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                    {t("more")}
                </button>
            </nav>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-[var(--color-scrim)] lg:hidden"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeMobileMenu();
                    }}
                >
                    <section
                        ref={menuPanelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-menu-title"
                        className="safe-area-bottom max-h-[86dvh] w-full overflow-y-auto rounded-t-3xl bg-[var(--color-surface)] p-4 shadow-2xl"
                    >
                        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--color-border-strong)]" aria-hidden="true" />
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 id="mobile-menu-title" className="text-xl font-bold">More</h2>
                                <p className="text-sm text-[var(--color-text-muted)]">Progress, library, and account</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeMobileMenu}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>

                        <nav className="grid grid-cols-2 gap-2" aria-label="More navigation">
                            {mobileMoreItems.map((item) => (
                                <NavigationLink
                                    key={item.to}
                                    item={item}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex min-h-14 items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                                            isActive
                                                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]"
                                                : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
                                        }`
                                    }
                                />
                            ))}
                        </nav>

                        <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                            <div className="mb-3">
                                <PreferenceControls />
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="ui-button w-full border border-red-200 bg-red-50 text-[var(--color-danger)] dark:border-red-900 dark:bg-red-950/30"
                            >
                                <LogOut className="h-5 w-5" aria-hidden="true" />
                                {t("logout")}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

function NavigationLink({ item, className, onClick }) {
    const Icon = item.icon;

    return (
        <NavLink to={item.to} className={className} onClick={onClick}>
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
        </NavLink>
    );
}

export default MainLayout;
