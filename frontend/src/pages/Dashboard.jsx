import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Brain,
    CheckCircle2,
    ChevronRight,
    Crown,
    Flame,
    GraduationCap,
    LineChart,
    Lock,
    Play,
    RefreshCw,
    Sparkles,
    Star,
    Target,
    Trophy,
} from "lucide-react";
import {
    getMyQuizResults,
    getTopics,
    getVocabularies,
} from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import PageSkeleton from "../components/PageSkeleton";

function Dashboard() {
    const { user, isPremium } = useAuth();
    const [topics, setTopics] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const displayName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "Learner";

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const [topicData, vocabularyData, quizResultData] = await Promise.all([
                getTopics(),
                getVocabularies(),
                getMyQuizResults(),
            ]);

            setTopics(Array.isArray(topicData) ? topicData : []);
            setVocabularies(Array.isArray(vocabularyData) ? vocabularyData : []);
            setQuizResults(Array.isArray(quizResultData) ? quizResultData : []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            setErrorMessage("We could not refresh your learning data. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // The async loader owns the request lifecycle and the related UI state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stats = useMemo(() => {
        const quizCount = quizResults.length;
        const scores = quizResults.map((item) => Number(item.score || 0));
        const averageScore = quizCount
            ? scores.reduce((sum, score) => sum + score, 0) / quizCount
            : 0;

        return {
            topics: topics.length,
            vocabularies: vocabularies.length,
            quizResults: quizCount,
            averageScore,
            bestScore: quizCount ? Math.max(...scores) : 0,
            xpPoints: user?.xp || 0,
            level: user?.level || 1,
            levelProgress: Math.min(Math.max(user?.levelProgress || 0, 0), 100),
            nextLevelXp: user?.nextLevelXp || 100,
            dailyStreak: user?.dailyStreak || 0,
        };
    }, [quizResults, topics.length, user, vocabularies.length]);

    const readyTopics = useMemo(
        () =>
            topics
                .map((topic) => ({
                    ...topic,
                    vocabularyCount:
                        topic.vocabularyCount ??
                        vocabularies.filter(
                            (vocabulary) => Number(vocabulary.topicId) === Number(topic.id)
                        ).length,
                }))
                .filter((topic) => !topic.locked && topic.vocabularyCount > 0)
                .slice(0, 4),
        [topics, vocabularies]
    );

    const nextTopic = readyTopics[0];
    const recentResults = quizResults.slice(0, 4);
    const weeklyTarget = 7;
    const weeklyCompleted = Math.min(stats.quizResults, weeklyTarget);
    const weeklyGoalPercent = Math.round((weeklyCompleted / weeklyTarget) * 100);

    if (loading) return <PageSkeleton variant="dashboard" />;

    return (
        <div className="app-page space-y-6">
            {errorMessage && (
                <div className="ui-alert flex flex-col gap-3 border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100 sm:flex-row sm:items-center sm:justify-between" role="alert">
                    <div>
                        <p className="font-bold">Dashboard data is unavailable</p>
                        <p className="mt-1 text-sm">{errorMessage}</p>
                    </div>
                    <button type="button" onClick={fetchDashboardData} className="ui-button shrink-0 border border-red-300 bg-white text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Try again
                    </button>
                </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
                <div className="ui-panel-accent relative overflow-hidden p-6 sm:p-8">
                    <div className="relative z-10 max-w-3xl">
                        <div className="ui-badge">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Personal learning path
                        </div>
                        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back, {displayName}
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
                            {nextTopic
                                ? `Continue with ${nextTopic.name} and keep your momentum going.`
                                : "Choose a topic and start building a learning routine that fits your level."}
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={nextTopic ? `/learn/${nextTopic.id}` : "/learn"}
                                className="ui-button ui-button-primary"
                            >
                                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                                {nextTopic ? "Continue learning" : "Start learning"}
                            </Link>
                            <Link to="/topics" className="ui-button ui-button-outline">
                                Browse topics
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                    <GraduationCap className="pointer-events-none absolute -bottom-10 -right-8 h-52 w-52 text-[var(--color-primary)] opacity-[0.07]" aria-hidden="true" />
                </div>

                <article className="ui-panel p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Level progress</p>
                            <h2 className="mt-1 text-3xl font-bold">Level {stats.level}</h2>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                            <Trophy className="h-6 w-6" aria-hidden="true" />
                        </span>
                    </div>
                    <div
                        className="mt-7 h-3 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]"
                        role="progressbar"
                        aria-label="Level progress"
                        aria-valuenow={stats.levelProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${stats.levelProgress}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className="font-bold">{stats.xpPoints} XP</span>
                        <span className="text-[var(--color-text-muted)]">{stats.nextLevelXp} XP target</span>
                    </div>
                    <div className="mt-6 flex items-center gap-3 rounded-xl bg-[var(--color-surface-subtle)] p-3">
                        <Flame className="h-5 w-5 text-[var(--color-warning)]" aria-hidden="true" />
                        <p className="text-sm"><span className="font-bold">{stats.dailyStreak} day streak</span><span className="text-[var(--color-text-muted)]"> · Keep showing up</span></p>
                    </div>
                </article>
            </section>

            <section aria-labelledby="overview-title">
                <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-primary)]">At a glance</p>
                        <h2 id="overview-title" className="text-2xl font-bold">Learning overview</h2>
                    </div>
                    <Link to="/analytics" className="hidden min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] sm:flex">
                        Full analytics <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <MetricCard icon={Star} label="Total XP" value={stats.xpPoints} helper="Experience earned" tone="amber" />
                    <MetricCard icon={BookOpen} label="Topics" value={stats.topics} helper="Available lessons" tone="teal" />
                    <MetricCard icon={Brain} label="Vocabulary" value={stats.vocabularies} helper="Words to explore" tone="indigo" />
                    <MetricCard icon={CheckCircle2} label="Quizzes" value={stats.quizResults} helper="Attempts completed" tone="green" />
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
                <Panel
                    title="Continue learning"
                    description="Topics that already have vocabulary ready to practise."
                    icon={GraduationCap}
                    action={<Link to="/learn" className="text-sm font-bold text-[var(--color-primary)] hover:underline">View all lessons</Link>}
                >
                    {readyTopics.length ? (
                        <div className="divide-y divide-[var(--color-border)]">
                            {readyTopics.map((topic, index) => (
                                <Link
                                    key={topic.id}
                                    to={`/learn/${topic.id}`}
                                    className="group flex min-h-20 items-center gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-[var(--color-surface-subtle)] sm:px-3"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] font-bold text-[var(--color-primary-hover)]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-bold">{topic.name}</span>
                                        <span className="mt-1 block truncate text-sm text-[var(--color-text-muted)]">
                                            {topic.vocabularyCount} words · {topic.description || "Vocabulary practice"}
                                        </span>
                                    </span>
                                    <span className="hidden rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs font-bold text-[var(--color-text-muted)] sm:inline-flex">
                                        {index === 0 ? "Up next" : "Ready"}
                                    </span>
                                    <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-primary)]" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="Your lesson queue is ready to grow"
                            description="Browse the topic library to find vocabulary sets for your next session."
                            actionLabel="Browse topics"
                            to="/topics"
                        />
                    )}
                </Panel>

                <div className="space-y-5">
                    <Panel title="Weekly target" description="Complete seven quiz sessions." icon={Target} compact>
                        <div className="flex items-end justify-between gap-3">
                            <p className="text-4xl font-bold tabular-nums">{weeklyCompleted}<span className="text-xl text-[var(--color-text-muted)]">/{weeklyTarget}</span></p>
                            <span className="ui-badge">{weeklyGoalPercent}%</span>
                        </div>
                        <div
                            className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]"
                            role="progressbar"
                            aria-label="Weekly quiz target"
                            aria-valuenow={weeklyGoalPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${weeklyGoalPercent}%` }} />
                        </div>
                        <Link to="/quiz" className="ui-button ui-button-outline mt-5 w-full">Practice now <ChevronRight className="h-4 w-4" aria-hidden="true" /></Link>
                    </Panel>

                    <Panel title="Quiz performance" description="Your results across all attempts." icon={LineChart} compact>
                        <div className="grid grid-cols-2 gap-3">
                            <ScoreBlock label="Average" value={stats.averageScore} />
                            <ScoreBlock label="Best" value={stats.bestScore} />
                        </div>
                    </Panel>
                </div>
            </section>

            <Panel
                title="Recent quiz results"
                description="Your latest attempts and scores."
                icon={BarChart3}
                action={<Link to="/quiz-results" className="text-sm font-bold text-[var(--color-primary)] hover:underline">View history</Link>}
            >
                {recentResults.length ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {recentResults.map((result) => (
                            <article key={result.id} className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] p-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-bold">{result.topicName || "Mixed practice"}</h3>
                                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                        {result.correctAnswers ?? 0}/{result.totalQuestions ?? 0} correct
                                    </p>
                                </div>
                                <span className="text-lg font-bold tabular-nums text-[var(--color-secondary)]">
                                    {formatScore(result.score)}%
                                </span>
                            </article>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Target}
                        title="No quiz results yet"
                        description="Complete a quiz and your score history will appear here."
                        actionLabel="Take a quiz"
                        to="/quiz"
                    />
                )}
            </Panel>

            {!isPremium && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30 sm:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                <Lock className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold">Expand your practice options</h2>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                                    Premium includes longer quizzes, premium topics, and export tools.
                                </p>
                            </div>
                        </div>
                        <Link to="/premium" className="ui-button shrink-0 bg-amber-600 text-white hover:bg-amber-700">
                            <Crown className="h-4 w-4" aria-hidden="true" />
                            Explore Premium
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

const metricTones = {
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    teal: "bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]",
    indigo: "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]",
    green: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
};

function MetricCard({ icon: Icon, label, value, helper, tone }) {
    return (
        <article className="ui-card p-4 sm:p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${metricTones[tone]}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">{value}</p>
            <p className="mt-1 hidden text-xs text-[var(--color-text-muted)] sm:block">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon: Icon, action, children, compact = false }) {
    return (
        <section className={`ui-panel ${compact ? "p-5" : "p-5 sm:p-6"}`}>
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
                        <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">{description}</p>
                    </div>
                </div>
                {action && <div className="hidden shrink-0 sm:block">{action}</div>}
            </div>
            {children}
            {action && <div className="mt-4 sm:hidden">{action}</div>}
        </section>
    );
}

function ScoreBlock({ label, value }) {
    return (
        <div className="rounded-xl bg-[var(--color-surface-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{formatScore(value)}<span className="text-base text-[var(--color-text-muted)]">%</span></p>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description, actionLabel, to }) {
    return (
        <div className="rounded-xl bg-[var(--color-surface-subtle)] px-5 py-7 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
            <Link to={to} className="ui-button ui-button-primary mt-5">
                {actionLabel}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
        </div>
    );
}

function formatScore(value) {
    const score = Number(value || 0);
    return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}

export default Dashboard;
