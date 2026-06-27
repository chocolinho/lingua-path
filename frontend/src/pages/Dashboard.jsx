import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    Flame,
    GraduationCap,
    LineChart,
    Medal,
    PlayCircle,
    Rocket,
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
import StatCard from "../components/StatCard";
import ProgressCard from "../components/ProgressCard";
import BadgeCard from "../components/BadgeCard";

function Dashboard() {
    const { user, fetchCurrentUser } = useAuth();
    const [topics, setTopics] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [topicData, vocabularyData, resultData] =
                    await Promise.all([
                        getTopics(),
                        getVocabularies(),
                        getMyQuizResults(),
                        fetchCurrentUser(),
                    ]);

                setTopics(topicData);
                setVocabularies(vocabularyData);
                setQuizResults(resultData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                setErrorMessage("Could not load your dashboard right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchCurrentUser]);

    const stats = useMemo(() => {
        const quizCount = quizResults.length;
        const scores = quizResults.map((item) => Number(item.score || 0));
        const averageScore =
            quizCount > 0
                ? scores.reduce((sum, score) => sum + score, 0) / quizCount
                : 0;
        const bestScore = quizCount > 0 ? Math.max(...scores) : 0;

        return {
            topics: topics.length,
            vocabularies: vocabularies.length,
            quizResults: quizCount,
            averageScore: averageScore.toFixed(1),
            bestScore: bestScore.toFixed(1),
            xpPoints: user?.xp ?? 0,
            level: user?.level ?? 1,
            currentLevelXp: user?.currentLevelXp ?? 0,
            nextLevelXp: user?.nextLevelXp ?? 100,
            levelProgress: Math.min(user?.levelProgress ?? 0, 100),
        };
    }, [quizResults, topics.length, user, vocabularies.length]);

    const displayName = user?.username || user?.email || "Learner";

    const topicCards = useMemo(
        () =>
            topics.slice(0, 6).map((topic) => ({
                ...topic,
                vocabularyCount: vocabularies.filter(
                    (vocabulary) =>
                        Number(vocabulary.topicId) === Number(topic.id)
                ).length,
            })),
        [topics, vocabularies]
    );

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center animate-bounce">
                        <Rocket size={56} className="text-[#58CC02]" />
                    </div>
                    <p className="font-black text-slate-500">
                        Loading your learning world...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-7">
            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#58CC02] via-[#1CB0F6] to-[#CE82FF] p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <Sparkles className="h-4 w-4" />
                            Welcome back, {displayName}
                        </div>

                        <h1 className="text-3xl font-black leading-tight md:text-5xl">
                            Keep your English streak moving today.
                        </h1>

                        <p className="mt-4 max-w-xl text-base font-semibold text-white/90 md:text-lg">
                            Learn a few words, answer a quick quiz, and turn
                            every correct answer into XP.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/learn"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-[#58CC02] shadow-lg transition-all hover:-translate-y-1"
                            >
                                <GraduationCap className="h-5 w-5" />
                                Start Lesson
                            </Link>
                            <Link
                                to="/quiz"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900/15 px-6 py-4 font-black text-white ring-1 ring-white/30 transition-all hover:-translate-y-1 hover:bg-slate-900/25"
                            >
                                <PlayCircle className="h-5 w-5" />
                                Practice Quiz
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white/20 p-5 backdrop-blur md:min-w-80">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-white/75">
                                    Current Level
                                </p>
                                <p className="text-5xl font-black">
                                    {stats.level}
                                </p>
                            </div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-yellow-500">
                                <Trophy className="h-9 w-9" />
                            </div>
                        </div>

                        <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/25">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-700"
                                style={{ width: `${stats.levelProgress}%` }}
                            />
                        </div>

                        <p className="mt-3 text-sm font-black text-white/85">
                            {stats.xpPoints} / {stats.nextLevelXp} XP
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={<Star size={28} />}
                    title="XP Points"
                    value={stats.xpPoints}
                    subtitle="from completed quizzes"
                    color="bg-yellow-100 text-yellow-500"
                />
                <StatCard
                    icon={<BookOpen size={28} />}
                    title="Topics"
                    value={stats.topics}
                    subtitle="available lessons"
                    color="bg-green-100 text-[#58CC02]"
                />
                <StatCard
                    icon={<Brain size={28} />}
                    title="Words"
                    value={stats.vocabularies}
                    subtitle="vocabulary bank"
                    color="bg-purple-100 text-purple-500"
                />
                <StatCard
                    icon={<Target size={28} />}
                    title="Quiz Attempts"
                    value={stats.quizResults}
                    subtitle="saved results"
                    color="bg-blue-100 text-[#1CB0F6]"
                />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ProgressCard
                        title="Weekly Quiz Goal"
                        value={stats.quizResults}
                        target={7}
                    />
                </div>

                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">
                                Quiz Performance
                            </h3>
                            <p className="text-sm font-semibold text-slate-500">
                                Average and best score
                            </p>
                        </div>
                        <LineChart className="h-7 w-7 text-[#1CB0F6]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl bg-green-50 p-4">
                            <p className="text-xs font-black text-slate-400">
                                Average
                            </p>
                            <p className="mt-1 text-3xl font-black text-[#58CC02]">
                                {stats.averageScore}%
                            </p>
                        </div>
                        <div className="rounded-3xl bg-blue-50 p-4">
                            <p className="text-xs font-black text-slate-400">
                                Best
                            </p>
                            <p className="mt-1 text-3xl font-black text-[#1CB0F6]">
                                {stats.bestScore}%
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            Lessons To Try
                        </h2>
                        <p className="font-semibold text-slate-500">
                            Real topics from your backend vocabulary library.
                        </p>
                    </div>

                    <Link
                        to="/learn"
                        className="hidden items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-1 sm:inline-flex"
                    >
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {topicCards.map((topic) => {
                        const hasWords = topic.vocabularyCount > 0;

                        return (
                            <Link
                                key={topic.id}
                                to={hasWords ? `/learn/${topic.id}` : "/learn"}
                                className={`group rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all ${
                                    hasWords
                                        ? "hover:-translate-y-1 hover:shadow-xl"
                                        : "cursor-not-allowed opacity-70"
                                }`}
                            >
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-[#58CC02]">
                                        <BookOpen className="h-7 w-7" />
                                    </div>
                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                                        {topic.vocabularyCount} words
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900">
                                    {topic.name}
                                </h3>
                                <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-500">
                                    {topic.description ||
                                        "Practice this vocabulary set with flashcards."}
                                </p>

                                <div className="mt-5 flex items-center gap-2 font-black text-[#58CC02]">
                                    {hasWords ? "Learn now" : "Add words first"}
                                    {hasWords && (
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-2xl font-black text-slate-900">
                        Milestones
                    </h2>
                    <p className="font-semibold text-slate-500">
                        Small wins that keep learning moving.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <BadgeCard
                        icon={<Flame size={30} />}
                        title="Warm Start"
                        description="Complete your first quiz session"
                        color="bg-orange-100 text-orange-500"
                    />
                    <BadgeCard
                        icon={<CheckCircle2 size={30} />}
                        title="Word Builder"
                        description="Explore lessons from real topics"
                        color="bg-blue-100 text-[#1CB0F6]"
                    />
                    <BadgeCard
                        icon={<Medal size={30} />}
                        title="Score Climber"
                        description="Improve your best quiz score"
                        color="bg-yellow-100 text-yellow-500"
                    />
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
