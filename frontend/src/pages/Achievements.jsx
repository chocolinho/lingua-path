import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Flame, Lock, Star, TrendingUp, Trophy } from "lucide-react";
import { getMyAchievements } from "../services/achievementService";
import PageSkeleton from "../components/PageSkeleton";

const iconMap = {
    Trophy,
    Star,
    TrendingUp,
    BadgeCheck,
    Flame,
};

function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setAchievements(await getMyAchievements());
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load achievements.");
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const unlockedCount = useMemo(
        () => achievements.filter((achievement) => achievement.unlocked).length,
        [achievements]
    );

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="kid-panel-soft p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-sm font-black text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
                            <Trophy className="h-4 w-4" />
                            Badge collection
                        </div>
                        <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">Achievements</h1>
                        <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
                            {unlockedCount} / {achievements.length} badges unlocked.
                        </p>
                    </div>
                    <div className="rounded-2xl border-2 border-yellow-100 bg-white px-5 py-4 text-center dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-4xl font-black text-slate-950 dark:text-white">{unlockedCount}</p>
                        <p className="text-xs font-black uppercase text-slate-400">
                            earned
                        </p>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {achievements.map((achievement) => {
                    const Icon = achievement.unlocked
                        ? iconMap[achievement.icon] || Trophy
                        : Lock;

                    return (
                        <article
                            key={achievement.code}
                            className={`rounded-[1.5rem] border p-5 shadow-sm transition-all ${
                                achievement.unlocked
                                    ? "kid-card border-yellow-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                                    : "border-slate-200 bg-slate-50 opacity-80 dark:border-slate-800 dark:bg-slate-900"
                            }`}
                        >
                            <div
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                                    achievement.unlocked
                                        ? "bg-yellow-100 text-yellow-500"
                                        : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                }`}
                            >
                                <Icon className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                                {achievement.title}
                            </h2>
                            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {achievement.description}
                            </p>
                            <p className={`mt-4 text-xs font-bold uppercase ${
                                achievement.unlocked
                                    ? "text-[#58CC02]"
                                    : "text-slate-400"
                            }`}>
                                {achievement.unlocked ? "Unlocked" : "Locked"}
                            </p>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default Achievements;
