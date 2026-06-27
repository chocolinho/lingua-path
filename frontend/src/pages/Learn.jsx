import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Brain,
    Clock,
    Dumbbell,
    Leaf,
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

function Learn() {
    const [topics, setTopics] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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
            "bg-green-100 text-[#58CC02]",
            "bg-yellow-100 text-yellow-500",
            "bg-blue-100 text-[#1CB0F6]",
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
                vocabularyCount: vocabularies.filter(
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
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center animate-bounce">
                        <BookOpen size={56} className="text-[#58CC02]" />
                    </div>
                    <p className="font-black text-slate-500">
                        Loading lessons...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {errorMessage && (
                <div className="rounded-3xl bg-red-50 p-4 font-bold text-red-500">
                    {errorMessage}
                </div>
            )}

            <section className="rounded-[2rem] bg-gradient-to-br from-[#58CC02] via-[#1CB0F6] to-[#CE82FF] p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                            <Sparkles className="h-4 w-4" />
                            Flashcard learning
                        </div>
                        <h1 className="text-3xl font-black md:text-5xl">
                            Pick a topic and flip through words.
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold text-white/90">
                            Lessons come directly from your backend topics and
                            vocabulary library.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center sm:min-w-72">
                        <div className="rounded-3xl bg-white/20 p-4">
                            <p className="text-3xl font-black">
                                {availableLessons}
                            </p>
                            <p className="text-xs font-black text-white/75">
                                ready topics
                            </p>
                        </div>
                        <div className="rounded-3xl bg-white/20 p-4">
                            <p className="text-3xl font-black">
                                {vocabularies.length}
                            </p>
                            <p className="text-xs font-black text-white/75">
                                total words
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">
                        Lesson Library
                    </h2>
                    <p className="font-semibold text-slate-500">
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
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 font-bold outline-none transition-all focus:border-[#58CC02] focus:ring-4 focus:ring-green-100"
                    />
                </div>
            </div>

            {topics.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <h2 className="text-2xl font-black text-slate-900">
                        No topics found
                    </h2>
                    <p className="mt-2 font-semibold text-slate-500">
                        Create topics first before starting a lesson.
                    </p>
                    <Link
                        to="/topics"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-3 font-black text-white"
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

                        return (
                            <article
                                key={topic.id}
                                className={`rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 ${
                                    hasWords
                                        ? "hover:-translate-y-1 hover:shadow-xl"
                                        : "opacity-70"
                                }`}
                            >
                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <div
                                        className={`flex h-16 w-16 items-center justify-center rounded-3xl ${topic.color}`}
                                    >
                                        <Icon className="h-8 w-8" />
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-black ${
                                            hasWords
                                                ? "bg-green-50 text-[#58CC02]"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {hasWords ? "Ready" : "Locked"}
                                    </span>
                                </div>

                                <h3 className="break-words text-xl font-black text-slate-900">
                                    {topic.name}
                                </h3>
                                <p className="mt-2 min-h-10 text-sm font-semibold text-slate-500">
                                    {topic.description ||
                                        "Learn this topic with flip cards and pronunciation."}
                                </p>

                                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                    <Brain className="h-5 w-5 text-[#1CB0F6]" />
                                    <span className="text-sm font-black text-slate-600">
                                        {topic.vocabularyCount} vocabulary words
                                    </span>
                                </div>

                                {hasWords ? (
                                    <Link
                                        to={`/learn/${topic.id}`}
                                        className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-5 py-3 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        Start Flashcards
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-black text-slate-400"
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
