import { useEffect, useState } from "react";
import {
    getTopics,
    getVocabularies,
    getMyQuizResults,
} from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import LearningCard from "../components/LearningCard";
import ProgressCard from "../components/ProgressCard";
import BadgeCard from "../components/BadgeCard";

function Dashboard() {
    const { user } = useAuth();

    const displayName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.email ||
        "Learner";

    const [stats, setStats] = useState({
        topics: 0,
        vocabularies: 0,
        quizResults: 0,
        averageScore: "0.0",
        bestScore: "0.0",
        xpPoints: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [topics, vocabularies, quizResults] = await Promise.all([
                    getTopics(),
                    getVocabularies(),
                    getMyQuizResults(),
                ]);

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
                        ? Math.max(
                            ...quizResults.map((item) =>
                                Number(item.score || 0)
                            )
                        )
                        : 0;

                const xpPoints =
                    vocabularies.length * 10 +
                    quizResults.reduce(
                        (sum, item) => sum + Number(item.correctAnswers || 0) * 5,
                        0
                    );

                setStats({
                    topics: topics.length,
                    vocabularies: vocabularies.length,
                    quizResults: quizCount,
                    averageScore: averageScore.toFixed(1),
                    bestScore: bestScore.toFixed(1),
                    xpPoints,
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const recommendedTopics = [
        {
            icon: "🐶",
            title: "Animals",
            description: "Learn animal vocabulary",
            progress: 70,
            color: "bg-green-100",
        },
        {
            icon: "🍕",
            title: "Food",
            description: "Practice food words",
            progress: 45,
            color: "bg-yellow-100",
        },
        {
            icon: "✈️",
            title: "Travel",
            description: "Useful travel English",
            progress: 30,
            color: "bg-blue-100",
        },
        {
            icon: "🏫",
            title: "School",
            description: "Classroom vocabulary",
            progress: 55,
            color: "bg-purple-100",
        },
        {
            icon: "👨‍👩‍👧",
            title: "Family",
            description: "Family member words",
            progress: 80,
            color: "bg-orange-100",
        },
        {
            icon: "⚽",
            title: "Sports",
            description: "Learn sports vocabulary",
            progress: 25,
            color: "bg-sky-100",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🦉</div>
                    <p className="text-slate-500 font-bold">
                        Loading your learning world...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-[2rem] p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-white/80 font-bold mb-2">
                        Welcome back, {displayName} 👋
                    </p>

                    <h1 className="text-3xl md:text-5xl font-black leading-tight">
                        Ready to learn English today?
                    </h1>

                    <p className="mt-4 text-white/90 text-lg">
                        Keep your streak alive and unlock new achievements.
                    </p>

                    <a
                        href="/quiz"
                        className="inline-block mt-6 bg-white text-[#58CC02] px-8 py-4 rounded-2xl font-black shadow-md hover:scale-105 transition-all"
                    >
                        Continue Learning
                    </a>
                </div>

                <div className="absolute right-6 bottom-0 text-8xl md:text-9xl opacity-90">
                    🚀
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon="⭐"
                    title="XP Points"
                    value={stats.xpPoints}
                    subtitle="total experience"
                    color="bg-yellow-100"
                />

                <StatCard
                    icon="📚"
                    title="Topics"
                    value={stats.topics}
                    subtitle="learning topics"
                    color="bg-blue-100"
                />

                <StatCard
                    icon="🧠"
                    title="Words"
                    value={stats.vocabularies}
                    subtitle="vocabulary learned"
                    color="bg-purple-100"
                />

                <StatCard
                    icon="📝"
                    title="Quiz Attempts"
                    value={stats.quizResults}
                    subtitle="completed quizzes"
                    color="bg-green-100"
                />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <ProgressCard
                        title="Weekly Learning Goal"
                        value={stats.quizResults}
                        target={7}
                    />
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-2">
                        Quiz Performance
                    </h3>

                    <p className="text-slate-500 text-sm mb-4">
                        Your average and best quiz score
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Average
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-black text-[#58CC02]">
                                    {stats.averageScore}
                                </span>
                                <span className="text-slate-400 font-bold mb-1">
                                    %
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                Best
                            </p>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-black text-[#1CB0F6]">
                                    {stats.bestScore}
                                </span>
                                <span className="text-slate-400 font-bold mb-1">
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">
                            Recommended Lessons
                        </h2>
                        <p className="text-slate-500">
                            Choose a topic and start learning.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {recommendedTopics.map((topic) => (
                        <LearningCard
                            key={topic.title}
                            icon={topic.icon}
                            title={topic.title}
                            description={topic.description}
                            progress={topic.progress}
                            color={topic.color}
                        />
                    ))}
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-2xl font-black text-slate-800">
                        Achievements
                    </h2>
                    <p className="text-slate-500">
                        Your learning milestones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <BadgeCard
                        icon="🔥"
                        title="Streak Starter"
                        description="Complete your first weekly learning goal"
                        color="bg-orange-100"
                    />

                    <BadgeCard
                        icon="📚"
                        title="Word Collector"
                        description="Build your vocabulary collection"
                        color="bg-blue-100"
                    />

                    <BadgeCard
                        icon="🎯"
                        title="Quiz Beginner"
                        description="Complete your first quiz"
                        color="bg-green-100"
                    />
                </div>
            </section>
        </div>
    );
}

export default Dashboard;