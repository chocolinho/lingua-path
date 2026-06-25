import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle } from "lucide-react";
import { getTopics } from "../services/topicService";
import { getVocabularies } from "../services/vocabularyService";

function Learn() {
    const [topics, setTopics] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearnData = async () => {
            try {
                const [topicData, vocabularyData] = await Promise.all([
                    getTopics(),
                    getVocabularies(),
                ]);

                setTopics(topicData);
                setVocabularies(vocabularyData);
            } catch (error) {
                console.error("Failed to load learn page", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLearnData();
    }, []);

    const getTopicIcon = (name) => {
        const lowerName = name.toLowerCase();

        if (lowerName.includes("animal")) return "🐶";
        if (lowerName.includes("food")) return "🍕";
        if (lowerName.includes("school")) return "🏫";
        if (lowerName.includes("family")) return "👨‍👩‍👧";
        if (lowerName.includes("travel")) return "✈️";
        if (lowerName.includes("sport")) return "⚽";
        if (lowerName.includes("nature")) return "🌿";
        if (lowerName.includes("color")) return "🎨";
        if (lowerName.includes("daily")) return "⏰";

        return "📚";
    };

    const getTopicColor = (index) => {
        const colors = [
            "bg-green-100 text-[#58CC02]",
            "bg-yellow-100 text-yellow-500",
            "bg-blue-100 text-[#1CB0F6]",
            "bg-purple-100 text-purple-500",
            "bg-orange-100 text-orange-500",
            "bg-sky-100 text-sky-500",
        ];

        return colors[index % colors.length];
    };

    const getVocabularyCountByTopic = (topicId) => {
        return vocabularies.filter(
            (vocabulary) => Number(vocabulary.topicId) === Number(topicId)
        ).length;
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <p className="text-slate-500 font-bold">
                        Loading lessons...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] rounded-[2rem] p-8 text-white">
                <h1 className="text-4xl font-black">Start Learning</h1>

                <p className="text-white/90 mt-3 max-w-xl">
                    Choose a topic, learn vocabulary with flashcards, and
                    practice with fun quizzes.
                </p>
            </div>

            {topics.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />

                    <h2 className="text-2xl font-black text-slate-800">
                        No topics found
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Create topics first before starting a lesson.
                    </p>

                    <Link
                        to="/topics"
                        className="inline-block mt-5 bg-[#58CC02] text-white px-6 py-3 rounded-2xl font-black"
                    >
                        Manage Topics
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-5">
                    {topics.map((topic, index) => {
                        const vocabularyCount = getVocabularyCountByTopic(
                            topic.id
                        );

                        return (
                            <div
                                key={topic.id}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all"
                            >
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl ${getTopicColor(
                                        index
                                    )}`}
                                >
                                    {getTopicIcon(topic.name)}
                                </div>

                                <h3 className="text-xl font-black text-slate-800">
                                    {topic.name}
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">
                                    {vocabularyCount} vocabulary words
                                </p>

                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-4">
                                    <div
                                        className="h-full bg-[#58CC02] rounded-full"
                                        style={{
                                            width:
                                                vocabularyCount > 0
                                                    ? "30%"
                                                    : "0%",
                                        }}
                                    />
                                </div>

                                <Link
                                    to={`/learn/${topic.id}`}
                                    className={`mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black ${
                                        vocabularyCount > 0
                                            ? "bg-[#58CC02] text-white"
                                            : "bg-slate-100 text-slate-400 pointer-events-none"
                                    }`}
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    {vocabularyCount > 0
                                        ? "Start"
                                        : "No Words"}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Learn;