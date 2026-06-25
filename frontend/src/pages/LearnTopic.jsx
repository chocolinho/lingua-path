import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVocabulariesByTopic } from "../services/vocabularyService";

function LearnTopic() {
    const { topicId } = useParams();

    const [vocabularies, setVocabularies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeaning, setShowMeaning] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchVocabularies = async () => {
            try {
                const data = await getVocabulariesByTopic(topicId);
                setVocabularies(data);
            } catch (error) {
                console.error("Failed to load vocabularies by topic", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVocabularies();
    }, [topicId]);

    const currentVocabulary = vocabularies[currentIndex];

    const progress =
        vocabularies.length > 0
            ? Math.round(((currentIndex + 1) / vocabularies.length) * 100)
            : 0;

    const handleNext = () => {
        if (currentIndex === vocabularies.length - 1) {
            setCompleted(true);
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        setShowMeaning(false);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setShowMeaning(false);
        }
    };

    const handleSpeak = () => {
        if (!currentVocabulary?.word) return;

        const utterance = new SpeechSynthesisUtterance(currentVocabulary.word);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return <p className="font-bold text-slate-500">Loading lesson...</p>;
    }

    if (vocabularies.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 text-center">
                <h1 className="text-3xl font-black text-slate-800">
                    No vocabularies found
                </h1>
                <Link to="/learn" className="text-[#58CC02] font-black">
                    Back to Learn
                </Link>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 text-center shadow-sm border border-slate-100">
                <div className="text-7xl mb-5">🎉</div>

                <h1 className="text-4xl font-black text-slate-800">
                    Lesson Completed!
                </h1>

                <p className="text-slate-500 font-bold mt-3">
                    You learned {vocabularies.length} words.
                </p>

                <p className="text-5xl font-black text-[#58CC02] mt-6">
                    +{vocabularies.length * 10} XP
                </p>

                <div className="flex gap-4 mt-8 justify-center">
                    <Link
                        to="/quiz"
                        className="bg-[#58CC02] text-white px-7 py-4 rounded-2xl font-black"
                    >
                        Practice Quiz
                    </Link>

                    <Link
                        to="/learn"
                        className="bg-slate-100 text-slate-600 px-7 py-4 rounded-2xl font-black"
                    >
                        Back to Learn
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-black text-slate-500">
                        Word {currentIndex + 1} of {vocabularies.length}
                    </p>

                    <p className="font-black text-[#58CC02]">{progress}%</p>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#58CC02] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                <p className="text-sm font-black text-slate-400 mb-4">
                    Flashcard Learning
                </p>

                <h1 className="text-6xl font-black text-slate-800 mb-6">
                    {currentVocabulary.word}
                </h1>

                <button
                    type="button"
                    onClick={handleSpeak}
                    className="bg-blue-50 text-[#1CB0F6] px-5 py-3 rounded-2xl font-black mb-6"
                >
                    🔊 Pronounce
                </button>

                {!showMeaning ? (
                    <button
                        type="button"
                        onClick={() => setShowMeaning(true)}
                        className="block mx-auto bg-[#58CC02] text-white px-8 py-4 rounded-2xl font-black"
                    >
                        Show Meaning
                    </button>
                ) : (
                    <div className="bg-green-50 rounded-3xl p-6 mt-4">
                        <p className="text-slate-400 font-bold">Meaning</p>

                        <h2 className="text-3xl font-black text-[#58CC02] mt-2">
                            {currentVocabulary.meaning}
                        </h2>

                        <p className="text-slate-500 mt-4 font-semibold">
                            {currentVocabulary.exampleSentence || "No example sentence."}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="bg-slate-100 text-slate-600 px-7 py-4 rounded-2xl font-black disabled:opacity-40"
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#58CC02] text-white px-7 py-4 rounded-2xl font-black"
                >
                    {currentIndex === vocabularies.length - 1
                        ? "Finish Lesson"
                        : "Next"}
                </button>
            </div>
        </div>
    );
}

export default LearnTopic;