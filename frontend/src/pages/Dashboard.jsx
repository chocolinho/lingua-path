import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
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
    Medal,
    PlayCircle,
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
        user?.email ||
        "Learner";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [topicData, vocabularyData, quizResultData] =
                    await Promise.all([
                        getTopics(),
                        getVocabularies(),
                        getMyQuizResults(),
                    ]);

                setTopics(topicData);
                setVocabularies(vocabularyData);
                setQuizResults(quizResultData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                setErrorMessage("Could not load dashboard data right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = useMemo(() => {
        const quizCount = quizResults.length;
        const averageScore =
            quizCount > 0
                ? quizResults.reduce(
                    (sum, item) => sum + Number(item.score || 0),
                    0
                ) / quizCount
                : 0;
        const bestScore =
            quizCount > 0
                ? Math.max(...quizResults.map((item) => Number(item.score || 0)))
                : 0;

        return {
            topics: topics.length,
            vocabularies: vocabularies.length,
            quizResults: quizCount,
            averageScore: averageScore.toFixed(1),
            bestScore: bestScore.toFixed(1),
            xpPoints: user?.xp || 0,
            level: user?.level || 1,
            levelProgress: Math.min(user?.levelProgress || 0, 100),
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
                            (vocabulary) =>
                                Number(vocabulary.topicId) === Number(topic.id)
                        ).length,
                }))
                .filter((topic) => !topic.locked && topic.vocabularyCount > 0)
                .slice(0, 4),
        [topics, vocabularies]
    );

    const recentResults = quizResults.slice(0, 4);
    const weeklyGoalPercent = Math.min(
        Math.round((stats.quizResults / 7) * 100),
        100
    );

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="app-page space-y-6">
            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="kid-panel-soft overflow-hidden p-6 md:p-7">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="kid-pill mb-4">
                                <Flame className="h-4 w-4" />
                                {stats.dailyStreak} day streak
                            </div>
                            <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
                                Welcome back, {displayName}
                            </h1>
                            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-300">
                                Keep the session focused: review a topic, take a quiz,
                                or check your ranking progress.
                            </p>
                        </div>

                        <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-black ${
                                isPremium
                                    ? "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200"
                                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            }`}
                        >
                            <Crown className="h-4 w-4" />
                            {isPremium ? "Premium" : "Free"}
                        </div>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        <ActionLink
                            to="/learn"
                            icon={<GraduationCap className="h-5 w-5" />}
                            title="Start learning"
                            description="Open lesson library"
                        />
                        <ActionLink
                            to="/quiz"
                            icon={<Target className="h-5 w-5" />}
                            title="Practice quiz"
                            description="Train recall"
                        />
                        <ActionLink
                            to="/ranking"
                            icon={<Trophy className="h-5 w-5" />}
                            title="View ranking"
                            description="Compare XP"
                        />
                    </div>
                </div>

                <div className="kid-panel p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Current level
                            </p>
                            <h2 className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">
                                Level {stats.level}
                            </h2>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300">
                            <Medal className="h-6 w-6" />
                        </div>
                    </div>

                    <div
                        className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                        role="progressbar"
                        aria-label="Level progress"
                        aria-valuenow={stats.levelProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${stats.levelProgress}%` }}
                        />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {stats.xpPoints} / {stats.nextLevelXp} XP
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MetricCard
                    icon={<Star className="h-5 w-5" />}
                    label="XP"
                    value={stats.xpPoints}
                    helper="Total experience"
                    tone="yellow"
                />
                <MetricCard
                    icon={<BookOpen className="h-5 w-5" />}
                    label="Topics"
                    value={stats.topics}
                    helper="Available lessons"
                    tone="green"
                />
                <MetricCard
                    icon={<Brain className="h-5 w-5" />}
                    label="Words"
                    value={stats.vocabularies}
                    helper="Vocabulary bank"
                    tone="blue"
                />
                <MetricCard
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    label="Quizzes"
                    value={stats.quizResults}
                    helper="Completed attempts"
                    tone="purple"
                />
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <Panel
                    title="Weekly rhythm"
                    description="A steady week beats one huge session."
                    icon={<LineChart className="h-5 w-5" />}
                    tone="green"
                >
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-4xl font-bold text-slate-950 dark:text-white">
                                {stats.quizResults}/7
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                quizzes completed
                            </p>
                        </div>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-[#58CC02] dark:bg-green-950">
                            {weeklyGoalPercent}%
                        </span>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${weeklyGoalPercent}%` }}
                        />
                    </div>
                </Panel>

                <Panel
                    title="Quiz performance"
                    description="Use your score trend to decide what to review next."
                    icon={<BarChart3 className="h-5 w-5" />}
                    tone="blue"
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <ScoreBlock label="Average score" value={stats.averageScore} />
                        <ScoreBlock label="Best score" value={stats.bestScore} />
                    </div>
                </Panel>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <Panel
                    title="Ready lessons"
                    description="Pulled from real backend topics with vocabulary."
                    icon={<GraduationCap className="h-5 w-5" />}
                    tone="green"
                >
                    {readyTopics.length === 0 ? (
                        <EmptyState
                            title="No lessons ready yet"
                            description="Add vocabulary to a topic before it appears here."
                            actionLabel="Manage topics"
                            to="/topics"
                        />
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {readyTopics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    to={`/learn/${topic.id}`}
                                    className="group rounded-2xl border border-green-100 bg-green-50/70 p-4 transition-all hover:-translate-y-0.5 hover:border-[#58CC02] hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100 dark:border-green-900 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate font-bold text-slate-950 dark:text-white">
                                                {topic.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {topic.description ||
                                                    "Practice this vocabulary set."}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                    <p className="mt-4 text-sm font-bold text-[#1CB0F6]">
                                        {topic.vocabularyCount} words
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </Panel>

                <Panel
                    title="Recent results"
                    description="Latest quiz attempts from your account."
                    icon={<Trophy className="h-5 w-5" />}
                    tone="purple"
                >
                    {recentResults.length === 0 ? (
                        <EmptyState
                            title="No quiz results yet"
                            description="Take your first quiz to see score history."
                            actionLabel="Start quiz"
                            to="/quiz"
                        />
                    ) : (
                        <div className="space-y-3">
                            {recentResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl bg-purple-50/70 p-4 dark:bg-purple-950/20"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-950 dark:text-white">
                                            {result.topicName || "Mixed practice"}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {result.correctAnswers}/{result.totalQuestions} correct
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#1CB0F6] dark:bg-slate-800">
                                        {Number(result.score || 0).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>
            </section>

            {!isPremium && (
                <section className="rounded-[1.5rem] border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/40">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                    Unlock longer practice sessions
                                </h2>
                                <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Premium adds longer quizzes, premium topics, and export tools.
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/premium"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                        >
                            <Crown className="h-4 w-4" />
                            View Premium
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

function ActionLink({ to, icon, title, description }) {
    return (
        <Link
            to={to}
            className="group rounded-2xl border-2 border-white bg-white p-4 text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-green-950/30 dark:focus:ring-green-900"
        >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-[#58CC02] dark:bg-green-950">
                {icon}
            </div>
            <p className="font-black text-slate-950 dark:text-white">{title}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </Link>
    );
}

function MetricCard({ icon, label, value, helper, tone = "blue" }) {
    const tones = {
        green: {
            card: "border-green-100 shadow-green-100",
            icon: "bg-green-50 text-[#58CC02] dark:bg-green-950",
        },
        blue: {
            card: "border-sky-100 shadow-sky-100",
            icon: "bg-sky-50 text-[#1CB0F6] dark:bg-sky-950",
        },
        purple: {
            card: "border-purple-100 shadow-purple-100",
            icon: "bg-purple-50 text-[#CE82FF] dark:bg-purple-950",
        },
        yellow: {
            card: "border-yellow-100 shadow-yellow-100",
            icon: "bg-yellow-50 text-yellow-500 dark:bg-yellow-950",
        },
    };
    const selectedTone = tones[tone] || tones.blue;

    return (
        <article className={`rounded-[1.5rem] border bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${selectedTone.card}`}>
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${selectedTone.icon}`}>
                {icon}
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
                {value}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">{helper}</p>
        </article>
    );
}

function Panel({ title, description, icon, children, tone = "blue" }) {
    const tones = {
        green: "bg-green-50 text-[#58CC02] dark:bg-green-950",
        blue: "bg-sky-50 text-[#1CB0F6] dark:bg-sky-950",
        purple: "bg-purple-50 text-[#CE82FF] dark:bg-purple-950",
        yellow: "bg-yellow-50 text-yellow-500 dark:bg-yellow-950",
    };

    return (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="mb-5 flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone] || tones.blue}`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </section>
    );
}

function ScoreBlock({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-950 dark:text-white">
                    {value}
                </span>
                <span className="mb-1 font-semibold text-slate-400">%</span>
            </div>
        </div>
    );
}

function EmptyState({ title, description, actionLabel, to }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-950">
            <PlayCircle className="mx-auto mb-3 h-9 w-9 text-slate-300" />
            <h3 className="font-bold text-slate-950 dark:text-white">{title}</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
                {description}
            </p>
            <Link
                to={to}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-4 py-2 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-green-100"
            >
                {actionLabel}
                <ChevronRight className="h-4 w-4" />
            </Link>
        </div>
    );
}

export default Dashboard;
