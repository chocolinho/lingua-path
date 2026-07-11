import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Star, Trophy, Users } from "lucide-react";
import PageSkeleton from "../components/PageSkeleton";
import { useLanguage } from "../context/LanguageContext";
import { getUserRanking } from "../services/rankingService";

function Ranking() {
    const { t } = useLanguage();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setRanking(await getUserRanking(20));
            } catch (error) {
                console.error(error);
                setErrorMessage("Could not load ranking right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    const currentUserRank = useMemo(
        () => ranking.find((item) => item.currentUser),
        [ranking]
    );

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const topThree = ranking.slice(0, 3);
    const remaining = ranking.slice(3);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="ui-panel p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <Trophy className="h-4 w-4" />
                            {t("learningLeague")}
                        </div>
                        <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-5xl">
                            {t("leaderboard")}
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-slate-500 dark:text-slate-400">
                            {t("rankingIntro")}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 md:min-w-64">
                        <p className="text-sm font-bold text-slate-400">
                            {t("yourRank")}
                        </p>
                        <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">
                            {currentUserRank ? `#${currentUserRank.rank}` : "-"}
                        </p>
                        <p className="mt-1 font-bold text-slate-500 dark:text-slate-400">
                            {currentUserRank?.xp ?? 0} {t("xp")}
                        </p>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            {ranking.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                    {t("noRanking")}
                </div>
            ) : (
                <>
                    <section className="grid gap-4 md:grid-cols-3">
                        {topThree.map((item) => (
                            <TopRankCard key={item.userId} item={item} />
                        ))}
                    </section>

                    <section className="ui-panel overflow-hidden">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                                {t("topLearners")}
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {remaining.map((item) => (
                                <RankingRow key={item.userId} item={item} />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function TopRankCard({ item }) {
    const colors = {
        1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        2: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
        3: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    };

    return (
        <article
            className={`ui-card p-5 ${
                item.currentUser
                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40"
                    : ""
            }`}
        >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${colors[item.rank]}`}>
                <Medal className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-400">#{item.rank}</p>
            <h2 className="mt-1 truncate text-xl font-bold text-slate-950 dark:text-white">
                {item.username}
            </h2>
            <div className="mt-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    <Star className="h-3.5 w-3.5" />
                    Level {item.level}
                </span>
                <span className="font-bold text-[#0F766E]">{item.xp} XP</span>
            </div>
        </article>
    );
}

function RankingRow({ item }) {
    return (
        <div
            className={`flex items-center justify-between gap-4 p-4 ${
                item.currentUser ? "bg-green-50 dark:bg-green-950/30" : ""
            }`}
        >
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    #{item.rank}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950 dark:text-white">
                        {item.username}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                        <Users className="h-4 w-4" />
                        Level {item.level} - {item.dailyStreak} day streak
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                {item.subscriptionType === "PREMIUM" && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-bold text-[#0F766E]">{item.xp} XP</span>
            </div>
        </div>
    );
}

export default Ranking;
