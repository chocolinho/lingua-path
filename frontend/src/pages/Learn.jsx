import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Brain,
    Clock,
    Crown,
    Dumbbell,
    Leaf,
    Lock,
    Palette,
    PawPrint,
    Plane,
    PlayCircle,
    School,
    Search,
    Sparkles,
    Utensils,
    Users,
} from "lucide-react";
import { getTopics } from "../services/topicService";
import { getVocabularies } from "../services/vocabularyService";
import { useAuth } from "../context/AuthContext";
import PremiumLockedModal from "../components/PremiumLockedModal";
import PageSkeleton from "../components/PageSkeleton";

function Learn() {
    const { isPremium } = useAuth();
    const [topics, setTopics] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    useEffect(() => {
        const fetchLearnData = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const [topicData, vocabularyData] = await Promise.all([
                    getTopics(),
                    getVocabularies(),
                ]);

                setTopics(topicData);
                setVocabularies(vocabularyData);
            } catch (error) {
                console.error("Failed to load learn page", error);
                setErrorMessage("Could not load lessons right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchLearnData();
    }, []);

    const getTopicIcon = (name = "") => {
        const lowerName = name.toLowerCase();

        if (lowerName.includes("animal")) return PawPrint;
        if (lowerName.includes("food")) return Utensils;
        if (lowerName.includes("school")) return School;
        if (lowerName.includes("family")) return Users;
        if (lowerName.includes("travel")) return Plane;
        if (lowerName.includes("sport")) return Dumbbell;
        if (lowerName.includes("nature")) return Leaf;
        if (lowerName.includes("color")) return Palette;
        if (lowerName.includes("daily")) return Clock;

        return BookOpen;
    };

    const getTopicColor = (index) => {
        const colors = [
            "bg-green-100 text-[#0F766E]",
            "bg-yellow-100 text-yellow-500",
            "bg-blue-100 text-[#4338CA]",
            "bg-purple-100 text-purple-500",
            "bg-orange-100 text-orange-500",
            "bg-teal-100 text-teal-500",
        ];

        return colors[index % colors.length];
    };

    const topicCards = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return topics
            .map((topic, index) => ({
                ...topic,
                color: getTopicColor(index),
                vocabularyCount:
                    topic.vocabularyCount ??
                    vocabularies.filter(
                        (vocabulary) =>
                            Number(vocabulary.topicId) === Number(topic.id)
                    ).length,
            }))
            .filter((topic) => {
                if (!normalizedSearch) return true;

                return (
                    topic.name?.toLowerCase().includes(normalizedSearch) ||
                    topic.description
                        ?.toLowerCase()
                        .includes(normalizedSearch)
                );
            });
    }, [searchTerm, topics, vocabularies]);

    const availableLessons = topicCards.filter(
        (topic) => topic.vocabularyCount > 0
    ).length;

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="app-page space-y-6">
            <PremiumLockedModal
                open={premiumModalOpen}
                title="Premium topic locked"
                description="Upgrade to Premium to learn premium topics, access advanced practice, and unlock smarter review features."
                onClose={() => setPremiumModalOpen(false)}
            />

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
                <div className="ui-panel p-6 md:p-7">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <Sparkles className="h-4 w-4" />
                            {isPremium ? "Premium library" : "Flashcard learning"}
                    </div>
                    <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                        Choose a topic, flip the card, hear the word.
                    </h1>
                    <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-500 dark:text-slate-400">
                        Lessons are loaded from your backend topic and vocabulary
                        data, so learners always practice real content.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-[#0F766E] dark:bg-green-950">
                            <BookOpen className="h-4 w-4" />
                            {availableLessons} ready topics
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-[#4338CA] dark:bg-sky-950">
                            <Brain className="h-4 w-4" />
                            {vocabularies.length} total words
                        </span>
                    </div>
                </div>

                <div className="ui-panel p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300">
                        <Crown className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                        {isPremium ? "All lessons unlocked" : "Free plan"}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                        {isPremium
                            ? "Premium learners can open every approved public topic."
                            : "Free learners can study free topics and upgrade when a premium lesson appears."}
                    </p>
                </div>
            </section>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        Lesson Library
                    </h2>
                    <p className="font-medium text-slate-500 dark:text-slate-400">
                        Empty topics are locked until vocabulary is added.
                    </p>
                </div>

                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search topics"
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 font-semibold outline-none transition-all focus:border-[#0F766E] focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {topics.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        No topics found
                    </h2>
                    <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">
                        Create topics first before starting a lesson.
                    </p>
                    <Link
                        to="/topics"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-6 py-3 font-bold text-white focus:outline-none focus:ring-4 focus:ring-green-100"
                    >
                        Manage Topics
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {topicCards.map((topic) => {
                        const Icon = getTopicIcon(topic.name);
                        const hasWords = topic.vocabularyCount > 0;
                        const isPremiumTopic = topic.accessType === "PREMIUM";
                        const isLocked = Boolean(topic.locked);
                        const canStart = hasWords && !isLocked;

                        return (
                            <article
                                key={topic.id}
                                className={`ui-card p-5 ${
                                    hasWords
                                        ? "dark:hover:border-green-900"
                                        : "opacity-70"
                                }`}
                            >
                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${topic.color}`}
                                    >
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                                                isPremiumTopic
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-50 text-[#0F766E]"
                                            }`}
                                        >
                                            {isPremiumTopic && (
                                                <Crown className="h-3.5 w-3.5" />
                                            )}
                                            {isPremiumTopic ? "Premium" : "Free"}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                canStart
                                                    ? "bg-green-50 text-[#0F766E]"
                                                    : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {canStart ? "Ready" : "Locked"}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="break-words text-xl font-bold text-slate-950 dark:text-white">
                                    {topic.name}
                                </h3>
                                <p className="mt-2 min-h-10 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                                    {topic.description ||
                                        "Learn this topic with flip cards and pronunciation."}
                                </p>

                                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                                    <Brain className="h-5 w-5 text-[#4338CA]" />
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                        {topic.vocabularyCount} vocabulary words
                                    </span>
                                </div>

                                {canStart ? (
                                    <Link
                                        to={`/learn/${topic.id}`}
                                        className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3 font-bold text-white shadow-sm transition-all  focus:outline-none focus:ring-4 focus:ring-green-100"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        Start Flashcards
                                    </Link>
                                ) : isLocked ? (
                                    <button
                                        type="button"
                                        onClick={() => setPremiumModalOpen(true)}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-100 px-5 py-3 font-bold text-yellow-700 transition-all  focus:outline-none focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <Lock className="h-5 w-5" />
                                        Unlock Premium
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-400 dark:bg-slate-800"
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        No Words Yet
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Learn;
