import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    Crown,
    Flame,
    Lock,
    Mail,
    Save,
    ShieldCheck,
    Star,
    Trophy,
    UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { changePassword, updateCurrentUser } from "../services/userService";
import PageSkeleton from "../components/PageSkeleton";

function Profile() {
    const {
        user,
        fetchCurrentUser,
        loadingUser,
        isPremium,
        subscriptionStatus,
    } = useAuth();
    const [username, setUsername] = useState("");
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const totalXp = user?.xp ?? 0;
    const level = user?.level ?? 1;
    const progress = Math.min(user?.levelProgress ?? 0, 100);
    const nextLevelXp = user?.nextLevelXp ?? 100;
    const premiumUntil = user?.premiumUntil
        ? new Date(user.premiumUntil).toLocaleDateString()
        : null;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsername(user?.username || "");
    }, [user]);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!username.trim()) {
            setErrorMessage("Username is required.");
            return;
        }

        try {
            setSavingProfile(true);
            await updateCurrentUser({ username: username.trim() });
            await fetchCurrentUser();
            setMessage("Profile updated successfully.");
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to update profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            setErrorMessage("Please enter both current and new password.");
            return;
        }

        try {
            setSavingPassword(true);
            await changePassword(passwordForm);
            setPasswordForm({ oldPassword: "", newPassword: "" });
            setMessage("Password changed successfully.");
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to change password.");
        } finally {
            setSavingPassword(false);
        }
    };

    if (loadingUser && !user) {
        return <PageSkeleton />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="ui-panel overflow-hidden p-6 md:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <UserRound className="h-4 w-4" />
                            Learner profile
                        </div>
                        <h1 className="break-words text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                            {user?.username || "Learner"}
                        </h1>
                        <p className="mt-3 max-w-xl text-base font-medium leading-7 text-slate-500 dark:text-slate-400">
                            Manage your account, track progress, and keep your
                            learning streak alive.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5 lg:min-w-80 dark:bg-slate-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-400">
                                    Level {level}
                                </p>
                                <p className="text-4xl font-bold text-slate-950 dark:text-white">{totalXp} XP</p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-yellow-500 dark:bg-slate-900">
                                <Trophy className="h-9 w-9" />
                            </div>
                        </div>
                        <div
                            className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                            role="progressbar"
                            aria-label="Level progress"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-3 text-sm font-bold text-slate-400">
                            {totalXp} / {nextLevelXp} XP
                        </p>
                    </div>
                </div>
            </section>

            {(message || errorMessage) && (
                <div
                    role="status"
                    className={`flex items-center gap-3 rounded-2xl p-4 font-semibold ${
                        message
                            ? "bg-green-50 text-[#0F766E]"
                            : "bg-red-50 text-red-500"
                    }`}
                >
                    {message ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                    )}
                    {message || errorMessage}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <ProfileStat
                    icon={<Star className="h-7 w-7" />}
                    label="XP Points"
                    value={totalXp}
                    color="bg-yellow-100 text-yellow-500"
                />
                <ProfileStat
                    icon={<Trophy className="h-7 w-7" />}
                    label="Current Level"
                    value={level}
                    color="bg-purple-100 text-[#6D28D9]"
                />
                <ProfileStat
                    icon={<Flame className="h-7 w-7" />}
                    label="Daily Streak"
                    value={user?.dailyStreak ?? 0}
                    color="bg-orange-100 text-orange-500"
                />
            </div>

            <section
                    className={`rounded-2xl border-2 p-6 shadow-sm ${
                    isPremium
                        ? "border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/40"
                        : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${
                                isPremium
                                    ? "bg-white text-yellow-500"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            <Crown className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Current Plan
                            </p>
                            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                                {isPremium ? "Premium" : "Free"} Plan
                            </h2>
                            <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                                Status: {subscriptionStatus}
                                {premiumUntil ? ` - valid until ${premiumUntil}` : ""}
                            </p>
                        </div>
                    </div>

                    {!isPremium && (
                        <Link
                            to="/premium"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-slate-950 shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-yellow-100"
                        >
                            <Crown className="h-5 w-5" />
                            Upgrade to Premium
                        </Link>
                    )}
                </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
                <form
                    onSubmit={handleProfileSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        Account
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Email is used for login and stays unchanged.
                    </p>

                    <label
                        htmlFor="profile-username"
                        className="mt-5 block text-sm font-bold text-slate-600 dark:text-slate-300"
                    >
                        Username
                    </label>
                    <div className="relative mt-2">
                        <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="profile-username"
                            value={username}
                            autoComplete="username"
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 font-semibold outline-none transition-all focus:border-[#0F766E] focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                    </div>

                    <label
                        htmlFor="profile-email"
                        className="mt-4 block text-sm font-bold text-slate-600 dark:text-slate-300"
                    >
                        Email
                    </label>
                    <div className="relative mt-2">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="profile-email"
                            value={user?.email || ""}
                            disabled
                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-4 pl-12 pr-4 font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-6 py-4 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <Save className="h-5 w-5" />
                        {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </form>

                <form
                    onSubmit={handlePasswordSubmit}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        Password
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Keep your learning account secure.
                    </p>

                    <label
                        htmlFor="current-password"
                        className="mt-5 block text-sm font-bold text-slate-600 dark:text-slate-300"
                    >
                        Current Password
                    </label>
                    <PasswordInput
                        id="current-password"
                        value={passwordForm.oldPassword}
                        autoComplete="current-password"
                        onChange={(value) =>
                            setPasswordForm((current) => ({
                                ...current,
                                oldPassword: value,
                            }))
                        }
                    />

                    <label
                        htmlFor="new-password"
                        className="mt-4 block text-sm font-bold text-slate-600 dark:text-slate-300"
                    >
                        New Password
                    </label>
                    <PasswordInput
                        id="new-password"
                        value={passwordForm.newPassword}
                        autoComplete="new-password"
                        onChange={(value) =>
                            setPasswordForm((current) => ({
                                ...current,
                                newPassword: value,
                            }))
                        }
                    />

                    <button
                        type="submit"
                        disabled={savingPassword}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4338CA] px-6 py-4 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <Lock className="h-5 w-5" />
                        {savingPassword ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function ProfileStat({ icon, label, value, color }) {
    return (
        <div className="ui-card p-5">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                {icon}
            </div>
            <p className="text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
        </div>
    );
}

function PasswordInput({ id, value, autoComplete, onChange }) {
    return (
        <div className="relative mt-2">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
                id={id}
                type="password"
                value={value}
                autoComplete={autoComplete}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 font-semibold outline-none transition-all focus:border-[#0F766E] focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
        </div>
    );
}

export default Profile;
