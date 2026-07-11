import { useEffect, useState } from "react";
import {
    BarChart3,
    BookOpen,
    CheckCircle2,
    Flame,
    Heart,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";
import PageSkeleton from "../components/PageSkeleton";
import { getMyAnalytics } from "../services/analyticsService";

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setErrorMessage("");
                setAnalytics(await getMyAnalytics());
            } catch (error) {
                console.error(error);
                setErrorMessage("Could not load your analytics right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    const cards = [
        {
            label: "Total XP",
            value: analytics?.totalXp ?? 0,
            helper: `Level ${analytics?.currentLevel ?? 1}`,
            icon: Trophy,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Quiz Attempts",
            value: analytics?.totalQuizAttempts ?? 0,
            helper: `${analytics?.averageScore ?? 0}% average`,
            icon: Target,
            color: "bg-sky-100 text-[#4338CA]",
        },
        {
            label: "Correct Answers",
            value: analytics?.totalCorrectAnswers ?? 0,
            helper: `${analytics?.totalWrongAnswers ?? 0} wrong answers`,
            icon: CheckCircle2,
            color: "bg-green-100 text-[#0F766E]",
        },
        {
            label: "Favorites",
            value: analytics?.favoriteVocabularyCount ?? 0,
            helper: `${analytics?.reviewedWrongAnswerCount ?? 0} mistakes resolved`,
            icon: Heart,
            color: "bg-pink-100 text-pink-500",
        },
    ];

    return (
        <div className="app-page space-y-6">
            <section className="ui-panel p-6 md:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <BarChart3 className="h-4 w-4" />
                            Learning analytics
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                            Your progress, clearer than ever.
                        </h1>
                        <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-500 dark:text-slate-400">
                            Track quiz performance, level growth, topic progress, and review habits from backend data.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5 lg:min-w-72 dark:bg-slate-950">
                        <p className="text-sm font-bold text-slate-400">Level Progress</p>
                        <p className="mt-1 text-5xl font-bold text-slate-950 dark:text-white">
                            {analytics?.levelProgress ?? 0}%
                        </p>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-700"
                                style={{ width: `${analytics?.levelProgress ?? 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel
                    title="Performance"
                    description="Best score, average score, and daily consistency."
                    icon={<Flame className="h-6 w-6" />}
                >
                    <div className="grid gap-3 sm:grid-cols-3">
                        <MiniStat label="Best Score" value={`${analytics?.bestScore ?? 0}%`} />
                        <MiniStat label="Average" value={`${analytics?.averageScore ?? 0}%`} />
                        <MiniStat label="Daily Streak" value={analytics?.dailyStreak ?? 0} />
                    </div>
                </Panel>

                <Panel
                    title="Recent Quiz Scores"
                    description="Latest completed quiz attempts."
                    icon={<Target className="h-6 w-6" />}
                >
                    <div className="space-y-3">
                        {(analytics?.recentQuizScores ?? []).length === 0 ? (
                            <EmptyState text="No quiz attempts yet." />
                        ) : (
                            analytics.recentQuizScores.map((quiz) => (
                                <div
                                    key={quiz.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-950 dark:text-white">
                                            {quiz.topicName}
                                        </p>
                                        <p className="text-sm font-medium text-slate-400">
                                            {quiz.correctAnswers}/{quiz.totalQuestions} correct
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#4338CA] dark:bg-slate-900">
                                        {quiz.score}%
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Panel>
            </section>

            <Panel
                title="Topic Progress"
                description="Vocabulary practice grouped by topic."
                icon={<BookOpen className="h-6 w-6" />}
            >
                <div className="grid gap-4 lg:grid-cols-2">
                    {(analytics?.topicProgressSummary ?? []).length === 0 ? (
                        <EmptyState text="Review vocabulary to build topic analytics." />
                    ) : (
                        analytics.topicProgressSummary.map((topic) => (
                            <article
                                key={topic.topicId}
                                className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold text-slate-950 dark:text-white">
                                            {topic.topicName}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-400">
                                            {topic.masteredWords}/{topic.reviewedWords} mastered
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#0F766E] dark:bg-slate-900">
                                        {topic.accuracy}%
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-white dark:bg-slate-900">
                                    <div
                                        className="h-full rounded-full bg-[#0F766E] transition-all duration-700"
                                        style={{ width: `${topic.accuracy}%` }}
                                    />
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-sm font-bold">
                                    <span className="inline-flex items-center gap-1 text-[#0F766E]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {topic.correctAnswers}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-red-400">
                                        <XCircle className="h-4 w-4" />
                                        {topic.wrongAnswers}
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </Panel>
        </div>
    );
}

function MetricCard({ label, value, helper, icon: Icon, color }) {
    return (
        <article className="ui-card p-5">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon, children }) {
    return (
        <section className="ui-panel p-5">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#4338CA] dark:bg-sky-950">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-6 text-center font-bold text-slate-400 dark:bg-slate-950">
            {text}
        </div>
    );
}

export default Analytics;
