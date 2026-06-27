import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    RotateCcw,
    Sparkles,
    Volume2,
} from "lucide-react";
import { getVocabulariesByTopic } from "../services/vocabularyService";

function LearnTopic() {
    const { topicId } = useParams();
    const [vocabularies, setVocabularies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchVocabularies = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const data = await getVocabulariesByTopic(topicId);
                setVocabularies(data);
                setCurrentIndex(0);
                setIsFlipped(false);
                setCompleted(false);
            } catch (error) {
                console.error("Failed to load vocabularies by topic", error);
                setErrorMessage("Could not load this lesson right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchVocabularies();
    }, [topicId]);

    const currentVocabulary = vocabularies[currentIndex];

    const progress = useMemo(
        () =>
            vocabularies.length > 0
                ? Math.round(((currentIndex + 1) / vocabularies.length) * 100)
                : 0,
        [currentIndex, vocabularies.length]
    );

    const handleNext = () => {
        if (currentIndex === vocabularies.length - 1) {
            setCompleted(true);
            return;
        }

        setCurrentIndex((previous) => previous + 1);
        setIsFlipped(false);
    };

    const handlePrevious = () => {
        if (currentIndex === 0) return;

        setCurrentIndex((previous) => previous - 1);
        setIsFlipped(false);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setCompleted(false);
    };

    const handleSpeak = () => {
        if (!currentVocabulary?.word || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentVocabulary.word);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center animate-bounce">
                        <GraduationCap size={56} className="text-[#58CC02]" />
                    </div>
                    <p className="font-black text-slate-500">
                        Loading flashcards...
                    </p>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-400" />
                <h1 className="text-2xl font-black text-slate-900">
                    Lesson unavailable
                </h1>
                <p className="mt-3 font-semibold text-red-500">
                    {errorMessage}
                </p>
                <Link
                    to="/learn"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-slate-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>
            </div>
        );
    }

    if (vocabularies.length === 0) {
        return (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h1 className="text-3xl font-black text-slate-900">
                    No vocabulary found
                </h1>
                <p className="mt-3 font-semibold text-slate-500">
                    Add words to this topic before starting flashcards.
                </p>
                <Link
                    to="/learn"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-6 py-3 font-black text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-center shadow-sm">
                <div className="bg-gradient-to-br from-green-50 via-sky-50 to-yellow-50 p-8 md:p-10">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white text-[#58CC02] shadow-lg">
                        <CheckCircle2 className="h-11 w-11" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 md:text-5xl">
                        Lesson Complete
                    </h1>
                    <p className="mt-3 font-semibold text-slate-500">
                        You reviewed {vocabularies.length} vocabulary words.
                    </p>
                </div>

                <div className="grid gap-3 p-6 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-4 font-black text-slate-700 transition-all hover:-translate-y-1"
                    >
                        <RotateCcw className="h-5 w-5" />
                        Review Again
                    </button>
                    <Link
                        to="/quiz"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-5 py-4 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1"
                    >
                        <Sparkles className="h-5 w-5" />
                        Practice Quiz
                    </Link>
                    <Link
                        to="/learn"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1CB0F6] px-5 py-4 font-black text-white shadow-lg shadow-sky-100 transition-all hover:-translate-y-1"
                    >
                        <BookOpen className="h-5 w-5" />
                        More Topics
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col gap-4">
                <Link
                    to="/learn"
                    className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:-translate-y-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Learn
                </Link>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <p className="font-black text-slate-500">
                            Word {currentIndex + 1} of {vocabularies.length}
                        </p>
                        <p className="font-black text-[#58CC02]">
                            {progress}%
                        </p>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#58CC02] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative h-[420px] cursor-pointer sm:h-[460px]"
                onClick={() => setIsFlipped((previous) => !previous)}
                style={{ perspective: "1200px" }}
            >
                <div
                    key={currentVocabulary.id}
                    className="relative h-full w-full transition-transform duration-700 ease-out"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                    }}
                >
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-6 text-center shadow-xl shadow-slate-100 md:p-10"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-[#58CC02]">
                            <Sparkles className="h-4 w-4" />
                            Tap to flip
                        </div>

                        <h1 className="max-w-full break-words text-5xl font-black text-slate-900 md:text-7xl">
                            {currentVocabulary.word}
                        </h1>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSpeak();
                            }}
                            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-5 py-3 font-black text-[#1CB0F6] transition-all hover:-translate-y-1"
                        >
                            <Volume2 className="h-5 w-5" />
                            Pronounce
                        </button>
                    </div>

                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-green-100 bg-green-50 p-6 text-center shadow-xl shadow-green-100 md:p-10"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <p className="mb-4 text-sm font-black uppercase tracking-wide text-green-500">
                            Meaning
                        </p>

                        <h2 className="max-w-full break-words text-4xl font-black text-[#58CC02] md:text-6xl">
                            {currentVocabulary.meaning}
                        </h2>

                        <p className="mt-7 max-w-2xl text-base font-semibold leading-relaxed text-slate-600 md:text-lg">
                            {currentVocabulary.exampleSentence ||
                                "No example sentence yet."}
                        </p>

                        <p className="mt-7 text-xs font-black text-slate-400">
                            Tap again to see the word
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-600 shadow-sm transition-all hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#58CC02] px-5 py-4 font-black text-white shadow-lg shadow-green-100 transition-all hover:-translate-y-1"
                >
                    {currentIndex === vocabularies.length - 1
                        ? "Finish"
                        : "Next"}
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default LearnTopic;
